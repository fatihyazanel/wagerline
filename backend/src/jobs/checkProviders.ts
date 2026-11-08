import {initDatabase,closeDatabase} from '../database/init'
import {probeProvider} from '../services/provider-probe'
async function main(){await initDatabase();for(const name of ['espn','sportdb','sportscore','thesportsdb','apisports','nhl','mlb','f1'])console.log(await probeProvider(name))}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(closeDatabase)
