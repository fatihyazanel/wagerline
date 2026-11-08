import cron, { type ScheduledTask } from 'node-cron'
import { quotaManager } from '../services/quota/quotaManager'

export interface SyncJob {
  name: string
  expression: string
  priority: string
  handler: () => Promise<void>
}

class Scheduler {
  private jobs: Map<string, ScheduledTask> = new Map()
  private running: Set<string> = new Set()

  registerJob(job: SyncJob): void {
    console.log(`📅 Registering job: ${job.name} (${job.expression})`)

    const task = cron.schedule(job.expression, async () => {
      if (this.running.has(job.name)) {
        console.log(`⏭️  Skipping ${job.name} (already running)`)
        return
      }

      // Check quota before running
      if (!quotaManager.canRequest(job.priority)) {
        console.log(`⛔ ${job.name} skipped: insufficient quota (${job.priority})`)
        return
      }

      this.running.add(job.name)
      console.log(`🔄 Running: ${job.name}`)

      try {
        await job.handler()
        console.log(`✅ Completed: ${job.name}`)
      } catch (error) {
        console.error(`❌ Error in ${job.name}:`, (error as any).message)
      } finally {
        this.running.delete(job.name)
      }
    })

    this.jobs.set(job.name, task)
  }

  stop(): void {
    this.jobs.forEach((task) => task.stop())
    console.log('🛑 Scheduler stopped')
  }

  getStatus() {
    return {
      jobs: Array.from(this.jobs.keys()),
      running: Array.from(this.running),
      jobCount: this.jobs.size,
      runningCount: this.running.size,
    }
  }
}

export const scheduler = new Scheduler()

// Register default jobs based on flow.md section 48
export function registerDefaultJobs() {
  // Jobs would be registered here in full implementation
  // Examples from flow.md:
  // scheduler.registerJob({
  //   name: 'liveSync',
  //   expression: '*/1 * * * *',  // every 1 minute
  //   priority: 'P0',
  //   handler: liveSync,
  // })
  // scheduler.registerJob({
  //   name: 'standingsSync',
  //   expression: '0 * * * *',  // every hour
  //   priority: 'P2',
  //   handler: standingsSync,
  // })
}
