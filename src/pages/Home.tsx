import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import EventDetails from '../components/EventDetails'
import RegistrationForm from '../components/RegistrationForm'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-fuchsia-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <EventDetails />
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  )
}
