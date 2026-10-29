"""
WAGERline ML Models
===================

4 adet temel prediksiyon modeli:
1. Win Probability Model (XGBoost)
2. Score Prediction Model (Poisson Regression)
3. Player Performance Model (Random Forest)
4. Injury Risk Model (Logistic Regression)

Installation:
    pip install xgboost scikit-learn pandas numpy scipy statsmodels
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
import xgboost as xgb
import statsmodels.api as sm
from scipy import stats
import pickle
from typing import Dict, Tuple, List
from datetime import datetime


# =============================================================================
# 1. WIN PROBABILITY MODEL (XGBoost Classification)
# =============================================================================

class WinProbabilityModel:
    """
    Predicts match outcome: Home Win, Draw, Away Win

    Model: XGBoost Classifier (3-class classification)
    Features: Team strength, form, head-to-head, ELO rating
    Output: Probability for each outcome (0-1 each, sum=1)
    """

    def __init__(self, model_path: str = 'models/win_probability_v1.pkl'):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'home_team_strength',
            'away_team_strength',
            'home_form',
            'away_form',
            'home_goals_per_game',
            'away_goals_per_game',
            'home_advantage',
            'head_to_head_advantage',
            'home_key_players',
            'away_key_players',
            'rest_days_home',
            'rest_days_away'
        ]

    def extract_features(self, match_data: Dict) -> np.ndarray:
        """
        Extract features from match data

        Args:
            match_data: {
                'home_team_id': int,
                'away_team_id': int,
                'home_team_points': int,
                'away_team_points': int,
                'competition_id': int
            }

        Returns:
            Feature vector (1D array)
        """
        features = []

        # TODO: Fetch from database
        # 1. Team strength (ELO or average points)
        home_strength = match_data.get('home_team_points', 0) / 38  # Normalize
        away_strength = match_data.get('away_team_points', 0) / 38

        # 2. Recent form (last 5 matches)
        home_form = self._calculate_form(match_data['home_team_id'])  # 0-1
        away_form = self._calculate_form(match_data['away_team_id'])

        # 3. Goals per game average
        home_goals_per_game = 1.5  # TODO: Calculate from stats
        away_goals_per_game = 1.2

        # 4. Home advantage bonus
        home_advantage = 0.07  # Typical home advantage ~7% win rate boost

        # 5. Head-to-head record
        h2h_advantage = self._calculate_h2h_advantage(
            match_data['home_team_id'],
            match_data['away_team_id']
        )

        # 6. Key players available
        home_key_players = 1.0  # TODO: Check injury list
        away_key_players = 1.0

        # 7. Rest days
        rest_days_home = self._get_rest_days(match_data['home_team_id'])
        rest_days_away = self._get_rest_days(match_data['away_team_id'])

        features = np.array([
            home_strength, away_strength,
            home_form, away_form,
            home_goals_per_game, away_goals_per_game,
            home_advantage, h2h_advantage,
            home_key_players, away_key_players,
            rest_days_home, rest_days_away
        ])

        return features

    def _calculate_form(self, team_id: int) -> float:
        """Calculate team form (0-1) from last 5 matches"""
        # TODO: Query database for last 5 matches
        # wins/5 would be simple, but could use more sophisticated metric
        return 0.6  # Placeholder

    def _calculate_h2h_advantage(self, home_id: int, away_id: int) -> float:
        """Calculate head-to-head advantage (-1 to 1)"""
        # TODO: Query H2H record
        # Positive = home team advantage, negative = away team advantage
        return 0.1  # Placeholder

    def _get_rest_days(self, team_id: int) -> int:
        """Days since last match"""
        # TODO: Query last match date
        return 3  # Placeholder

    def train(self, X_train: np.ndarray, y_train: np.ndarray):
        """
        Train XGBoost model

        Args:
            X_train: Feature matrix (n_samples, n_features)
            y_train: Labels (0=Home Win, 1=Draw, 2=Away Win)
        """
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)

        # Create and train model
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        self.model.fit(X_scaled, y_train)

    def predict(self, match_data: Dict) -> Dict[str, float]:
        """
        Predict match outcome

        Returns: {
            'home_win_prob': float (0-1),
            'draw_prob': float (0-1),
            'away_win_prob': float (0-1),
            'confidence': float (0-1),
            'recommendation': str ('Home'|'Draw'|'Away')
        }
        """
        if self.model is None:
            return self._placeholder_prediction()

        features = self.extract_features(match_data)
        features_scaled = self.scaler.transform(features.reshape(1, -1))

        probabilities = self.model.predict_proba(features_scaled)[0]

        confidence = max(probabilities)
        best_outcome = np.argmax(probabilities)
        recommendations = ['Home', 'Draw', 'Away']

        return {
            'home_win_prob': float(probabilities[0]),
            'draw_prob': float(probabilities[1]),
            'away_win_prob': float(probabilities[2]),
            'confidence': float(confidence),
            'recommendation': recommendations[best_outcome]
        }

    def _placeholder_prediction(self) -> Dict[str, float]:
        """Placeholder when model not trained"""
        return {
            'home_win_prob': 0.45,
            'draw_prob': 0.27,
            'away_win_prob': 0.28,
            'confidence': 0.50,
            'recommendation': 'Home'
        }

    def save(self):
        """Save model to disk"""
        with open(self.model_path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler
            }, f)

    def load(self):
        """Load model from disk"""
        with open(self.model_path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']


# =============================================================================
# 2. SCORE PREDICTION MODEL (Poisson Regression)
# =============================================================================

class ScorePredictionModel:
    """
    Predicts match score using Poisson regression

    Theory: Goal count in football follows Poisson distribution
    Separate models for home and away teams
    """

    def __init__(self):
        self.home_model = None
        self.away_model = None

    def extract_features(self, match_data: Dict) -> Tuple[np.ndarray, np.ndarray]:
        """
        Extract features for home and away teams

        Returns: (home_features, away_features)
        """
        # TODO: Get from database
        # Expected goals (xG) features

        home_features = np.array([
            1.2,  # home_team_attack_strength
            0.8,  # home_team_defense_strength
            1.3,  # home_goals_per_game
            0.9,  # away_defense_strength
        ])

        away_features = np.array([
            1.0,  # away_team_attack_strength
            0.9,  # away_team_defense_strength
            1.0,  # away_goals_per_game
            0.85,  # home_defense_strength
        ])

        return home_features, away_features

    def train(self, X_home: np.ndarray, y_home: np.ndarray,
              X_away: np.ndarray, y_away: np.ndarray):
        """
        Train Poisson regression models

        Args:
            X_home: Features for home team predictions
            y_home: Goals scored by home team
            X_away: Features for away team predictions
            y_away: Goals scored by away team
        """
        # Home model
        self.home_model = sm.GLM(
            y_home, X_home,
            family=sm.families.Poisson()
        ).fit()

        # Away model
        self.away_model = sm.GLM(
            y_away, X_away,
            family=sm.families.Poisson()
        ).fit()

    def predict(self, match_data: Dict) -> Dict:
        """
        Predict match score

        Returns: {
            'expected_home_goals': float,
            'expected_away_goals': float,
            'most_likely_score': str ('2-1' etc),
            'score_probabilities': {
                '0-0': float, '1-0': float, ...
            }
        }
        """
        if self.home_model is None or self.away_model is None:
            return self._placeholder_prediction()

        home_features, away_features = self.extract_features(match_data)

        # Get expected goals (lambda parameter of Poisson distribution)
        lambda_home = float(self.home_model.predict(home_features.reshape(1, -1))[0])
        lambda_away = float(self.away_model.predict(away_features.reshape(1, -1))[0])

        # Generate score probabilities (all combinations 0-5)
        score_probs = {}
        most_likely_score = None
        max_prob = 0

        for h_goals in range(6):
            for a_goals in range(6):
                prob = (
                    stats.poisson.pmf(h_goals, lambda_home) *
                    stats.poisson.pmf(a_goals, lambda_away)
                )
                score_key = f'{h_goals}-{a_goals}'
                score_probs[score_key] = float(prob)

                if prob > max_prob:
                    max_prob = prob
                    most_likely_score = score_key

        return {
            'expected_home_goals': round(lambda_home, 2),
            'expected_away_goals': round(lambda_away, 2),
            'most_likely_score': most_likely_score,
            'score_probabilities': {
                k: v for k, v in sorted(
                    score_probs.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:10]  # Top 10
            }
        }

    def _placeholder_prediction(self) -> Dict:
        """Placeholder when model not trained"""
        return {
            'expected_home_goals': 1.5,
            'expected_away_goals': 1.2,
            'most_likely_score': '1-1',
            'score_probabilities': {
                '1-1': 0.15, '2-1': 0.13, '1-0': 0.12,
                '2-0': 0.10, '0-1': 0.09, '1-2': 0.08
            }
        }


# =============================================================================
# 3. PLAYER PERFORMANCE MODEL (Random Forest)
# =============================================================================

class PlayerPerformanceModel:
    """
    Predicts individual player performance rating

    Output: Expected player rating (0-10), goal/assist probabilities
    """

    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=50, max_depth=10)

    def predict(self, player_data: Dict) -> Dict[str, float]:
        """
        Predict player performance

        Returns: {
            'expected_rating': float (0-10),
            'probability_goal': float (0-1),
            'probability_assist': float (0-1)
        }
        """
        # TODO: Implement when training data available
        return {
            'expected_rating': 7.2,
            'probability_goal': 0.12,
            'probability_assist': 0.08
        }


# =============================================================================
# 4. INJURY RISK MODEL (Logistic Regression)
# =============================================================================

class InjuryRiskModel:
    """
    Predicts injury risk for players

    Features: Age, recent workload, injury history, position
    Output: Injury probability 0-100%
    """

    def __init__(self):
        self.model = LogisticRegression()

    def predict(self, player_data: Dict) -> float:
        """
        Predict injury risk percentage

        Args:
            player_data: {'age': int, 'minutes_last_7days': int, ...}

        Returns: Injury risk percentage (0-100)
        """
        # TODO: Implement when training data available
        return 5.0  # Placeholder


# =============================================================================
# MAIN PREDICTION ENGINE
# =============================================================================

class PredictionEngine:
    """
    Orchestrates all models for match predictions
    """

    def __init__(self):
        self.win_model = WinProbabilityModel()
        self.score_model = ScorePredictionModel()
        self.player_model = PlayerPerformanceModel()
        self.injury_model = InjuryRiskModel()

    def predict_match(self, match_data: Dict) -> Dict:
        """
        Generate complete match prediction
        """
        win_pred = self.win_model.predict(match_data)
        score_pred = self.score_model.predict(match_data)

        return {
            'match_id': match_data.get('id'),
            'timestamp': datetime.now().isoformat(),
            'win_probability': {
                'home': win_pred['home_win_prob'],
                'draw': win_pred['draw_prob'],
                'away': win_pred['away_win_prob']
            },
            'score_prediction': {
                'expected_home_goals': score_pred['expected_home_goals'],
                'expected_away_goals': score_pred['expected_away_goals'],
                'most_likely_score': score_pred['most_likely_score']
            },
            'confidence': win_pred['confidence'],
            'recommendation': win_pred['recommendation']
        }


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == '__main__':
    # Initialize engine
    engine = PredictionEngine()

    # Example match
    match_data = {
        'id': 12345,
        'home_team_id': 1,
        'away_team_id': 2,
        'home_team_points': 30,
        'away_team_points': 25
    }

    # Get prediction
    prediction = engine.predict_match(match_data)
    print("Match Prediction:")
    print(f"  Home Win: {prediction['win_probability']['home']:.1%}")
    print(f"  Draw: {prediction['win_probability']['draw']:.1%}")
    print(f"  Away Win: {prediction['win_probability']['away']:.1%}")
    print(f"  Expected Score: {prediction['score_prediction']['most_likely_score']}")
    print(f"  Recommendation: {prediction['recommendation']}")
