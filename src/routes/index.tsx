import { LandingToast } from '#/components/LandingToast'
import { createFileRoute } from '@tanstack/react-router'
import {
  BenefitsSection,
  FinalCTASection,
  Footer,
  HeroSection,
  HowItWorksSection,
  Navbar,
  ProductPreviewSection,
  ResumeVersionsSection,
  TemplatesSection,
} from '#/components/landing'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <LandingToast />
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ProductPreviewSection />
        <TemplatesSection />
        <HowItWorksSection />
        <ResumeVersionsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}
