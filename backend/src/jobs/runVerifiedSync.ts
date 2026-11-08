import {initDatabase,closeDatabase} from '../database/init'
import {refreshSportscore,sportscoreStatus} from '../services/sportscore-refresh'
import {refreshOfficial,officialRefreshStatus} from '../services/official-refresh'
async function run(){await initDatabase();await refreshSportscore();await refreshOfficial();if(sportscoreStatus.error||officialRefreshStatus.errors.length)throw Error('One or more verified providers failed; inspect integration status');console.log('Verified provider refresh completed')}
run().catch(e=>{console.error(e.message);process.exitCode=1}).finally(closeDatabase)
