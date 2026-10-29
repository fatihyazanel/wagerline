import TopNav from './components/TopNav'
import PageHeader from './components/PageHeader'
import { RouterProvider, useRouter } from './app/router'
import { screens } from './screens'

function ActiveScreen() {
  const { screen } = useRouter()
  const Screen = screens[screen]
  return <Screen />
}

export default function App() {
  return (
    <RouterProvider>
      <div className="app">
        <TopNav />
        <PageHeader />

        <main className="content-well">
          <ActiveScreen />
        </main>

        <div className="app__bottom" />
      </div>
    </RouterProvider>
  )
}
