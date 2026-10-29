console.log('[Test] Starting import test...')

try {
  console.log('[Test] Importing database init...')
  const { initDatabase, getDb } = require('./src/database/init')
  console.log('[Test] Database init imported successfully')

  console.log('[Test] Importing routes...')
  const { liveRoutes } = require('./src/routes/live')
  console.log('[Test] Live routes imported successfully')

  const { healthRoutes } = require('./src/routes/health')
  console.log('[Test] Health routes imported successfully')

  console.log('[Test] All imports successful!')
} catch (error) {
  console.error('[Test] IMPORT ERROR:', error)
  console.error('[Test] Error details:', (error as any).message)
  console.error('[Test] Stack:', (error as any).stack)
}
