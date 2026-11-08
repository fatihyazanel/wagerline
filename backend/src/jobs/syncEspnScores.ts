import {initDatabase,closeDatabase} from '../database/init'
import {refreshEspn,espnRefreshStatus} from '../services/espn-refresh'
async function run(){await initDatabase();await refreshEspn();console.log(JSON.stringify(espnRefreshStatus));if(espnRefreshStatus.errors.length)process.exitCode=1}
run().catch(e=>{console.error(e.message);process.exitCode=1}).finally(closeDatabase)
