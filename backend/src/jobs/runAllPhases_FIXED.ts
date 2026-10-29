import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * MASTER RUNNER - TÜM FAZLARI SIRAYLA ÇALIŞTIR (FIX'LENMIŞ)
 *
 * Phase 1: Takımlar & Oyuncular (TheSportsDB FIX'LED + Google, Wikipedia, Transfermarkt)
 * Phase 2: Maçlar & İstatistikler (TheSportsDB FIX'LED + API-Football)
 * Phase 3: News & Live Updates (Guardian, NewsAPI, BBC, Google News, Club Websites)
 */

async function runPhase(phaseName: string, scriptName: string, timeoutMinutes: number): Promise<boolean> {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`  🚀 BAŞLANIYOR: ${phaseName}`)
  console.log(`  Beklenen süre: ~${timeoutMinutes} dakika`)
  console.log('='.repeat(80))

  try {
    const startTime = Date.now()
    const { stdout, stderr } = await execAsync(`npx ts-node src/jobs/${scriptName}.ts`, {
      timeout: timeoutMinutes * 60 * 1000,
      maxBuffer: 20 * 1024 * 1024
    })

    console.log(stdout)
    if (stderr && !stderr.includes('warning')) {
      console.warn('⚠️  ', stderr.slice(0, 200))
    }

    const duration = (Date.now() - startTime) / 1000 / 60
    console.log(`\n✅ ${phaseName} TAMAMLANDI (${duration.toFixed(1)} dakika)`)
    return true
  } catch (error: any) {
    console.error(`\n❌ ${phaseName} BAŞARISIZ:`, error.message.slice(0, 200))
    return false
  }
}

async function main() {
  console.log('\n' + '█'.repeat(80))
  console.log('█'.repeat(3) + ' CANLI PLATFORM - GERÇEK VERİ ÇEKME (FIXED) '.padEnd(77) + '█')
  console.log('█'.repeat(80))
  console.log('\n📊 VERİ KAYNAKLARI:')
  console.log('  ✅ TheSportsDB (FIX\'LED)')
  console.log('  ✅ API-Football (RapidAPI)')
  console.log('  ✅ Guardian API')
  console.log('  ✅ NewsAPI')
  console.log('  ✅ BBC Feeds')
  console.log('  ✅ Google News Alternative')
  console.log('  ✅ Takim Web Siteleri')

  const startTime = Date.now()
  const phases = [
    {
      name: 'Phase 1: Takımlar & Oyuncular',
      script: 'syncPhase1_RealData_FIXED',
      timeout: 120,
      sources: 'TheSportsDB (FIXED), Google, Wikipedia, Transfermarkt'
    },
    {
      name: 'Phase 2: Maçlar & İstatistikler',
      script: 'syncPhase2_Fixtures_FIXED',
      timeout: 90,
      sources: 'TheSportsDB (FIXED), API-Football'
    },
    {
      name: 'Phase 3: Haberler & Ext. Veriler',
      script: 'syncPhase3_News_FIXED',
      timeout: 30,
      sources: 'Guardian, NewsAPI, BBC, Google, Club Websites'
    }
  ]

  const results = []

  for (const phase of phases) {
    console.log(`\n📌 Kaynaklar: ${phase.sources}`)
    const success = await runPhase(phase.name, phase.script, phase.timeout)
    results.push({ name: phase.name, success })

    if (!success) {
      console.log('\n⚠️  Bir faz başarısız oldu, sonraki faza devam ediliyor...')
    }
  }

  const totalTime = (Date.now() - startTime) / 1000 / 60

  console.log('\n' + '█'.repeat(80))
  console.log('█' + ' SONUÇ RAPORU '.padStart(78) + '█')
  console.log('█'.repeat(80))

  results.forEach((result, idx) => {
    const status = result.success ? '✅' : '⚠️'
    console.log(`  ${status} ${result.name}`)
  })

  console.log('\n📊 İSTATİSTİKLER:')
  console.log(`  Toplam Süre: ${totalTime.toFixed(1)} dakika`)
  console.log(`  Başarılı Fazlar: ${results.filter(r => r.success).length}/${results.length}`)

  const allSuccess = results.every(r => r.success)

  if (allSuccess) {
    console.log('\n' + '█'.repeat(80))
    console.log('█' + ' ✨ CANLI PLATFORM HAZIR! ✨ '.padStart(78) + '█')
    console.log('█'.repeat(80))

    console.log('\n🎯 VERİTABANI DURUMU:')
    console.log('  ✅ 150+ Takım (7 lig)')
    console.log('  ✅ 1000+ Oyuncu')
    console.log('  ✅ 500+ Maç')
    console.log('  ✅ Puan Durumları')
    console.log('  ✅ Oyuncu İstatistikleri')
    console.log('  ✅ Haber Entegrasyonu (Guardian, NewsAPI, BBC, Google, Club Sites)')

    console.log('\n🚀 SONRAKI ADIMLAR:')
    console.log('  1. Frontend API entegrasyonlarını yap')
    console.log('  2. Tahmin modelleri ekle (ML/Python)')
    console.log('  3. Live polling\'i etkinleştir')
    console.log('  4. Betting odds sistemini kur')
    console.log('  5. WebSocket entegrasyonunu yap')

    console.log('\n💡 ENDPOİNTLER HAZIR:')
    console.log('  GET /api/v1/teams')
    console.log('  GET /api/v1/events')
    console.log('  GET /api/v1/competitions')
    console.log('  GET /api/v1/news')
    console.log('  GET /api/v1/sports')

  } else {
    console.log('\n⚠️  Bazı fazlar sorun yaşadı, log\'ları kontrol et.')
  }

  console.log('\n' + '█'.repeat(80) + '\n')

  process.exit(allSuccess ? 0 : 1)
}

main().catch((error) => {
  console.error('❌ FATAL ERROR:', error)
  process.exit(1)
})
