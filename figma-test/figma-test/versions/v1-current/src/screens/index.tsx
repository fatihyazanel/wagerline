import type { ComponentType } from 'react'
import type { ScreenKey } from '../app/roles'

import DealerDashboard from './DealerDashboard'
import DealerLeague from './DealerLeague'
import DealerBadges from './DealerBadges'
import DealerChallenge from './DealerChallenge'
import DealerRegion from './DealerRegion'
import PublicOverview from './PublicOverview'
import CsmDealers from './CsmDealers'
import CsmDealerDetail from './CsmDealerDetail'
import CsmChallengeManage from './CsmChallengeManage'
import RegionalCsms from './RegionalCsms'
import RegionalOverview from './RegionalOverview'
import DirectorComparison from './DirectorComparison'
import AdminOverview from './AdminOverview'
import AdminLeague from './AdminLeague'
import AdminBadges from './AdminBadges'
import AdminRegion from './AdminRegion'
import AdminAccess from './AdminAccess'
import AdminAudit from './AdminAudit'

export const screens: Record<ScreenKey, ComponentType> = {
  'dealer-dashboard': DealerDashboard,
  'dealer-league': DealerLeague,
  'dealer-badges': DealerBadges,
  'dealer-challenge': DealerChallenge,
  'dealer-region': DealerRegion,
  'public-overview': PublicOverview,
  'csm-dealers': CsmDealers,
  'csm-dealer-detail': CsmDealerDetail,
  'csm-challenge-manage': CsmChallengeManage,
  'regional-csms': RegionalCsms,
  'regional-overview': RegionalOverview,
  'director-comparison': DirectorComparison,
  'admin-overview': AdminOverview,
  'admin-league': AdminLeague,
  'admin-badges': AdminBadges,
  'admin-region': AdminRegion,
  'admin-access': AdminAccess,
  'admin-audit': AdminAudit,
}
