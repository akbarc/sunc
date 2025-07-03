import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Instagram, Users, Star, Gift } from 'lucide-react';

const LandingContainer = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
`;

const SignInLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #ffffff;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    color: #000000;
  }
`;

const HeroSection = styled.section`
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
              url('https://images.unsplash.com/photo-1566733971017-fc4277cd2d9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #0066ff;
  color: #ffffff;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: #0052cc;
    transform: translateY(-2px);
  }
`;

const HowItWorksSection = styled.section`
  padding: 5rem 2rem;
  background: #111111;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #0066ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #ffffff;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

const SocialProofSection = styled.section`
  padding: 3rem 2rem;
  background: #000000;
  overflow: hidden;
`;

const VenueLogos = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  animation: scroll 30s linear infinite;
  white-space: nowrap;

  @keyframes scroll {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const VenueLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #666666;
  opacity: 0.7;
  min-width: 150px;
  text-align: center;
`;

const Footer = styled.footer`
  padding: 2rem;
  background: #000000;
  border-top: 1px solid #333333;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const FooterLink = styled.a`
  color: #666666;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: #ffffff;
  }
`;

const InstagramLink = styled.a`
  color: #0066ff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #0052cc;
  }
`;

const venues = [
  'The Grand', 'Skyline Lounge', 'Underground', 'Rooftop 360', 
  'Velvet Room', 'The Basement', 'Cloud Nine', 'Midnight Club',
  'The Grand', 'Skyline Lounge', 'Underground', 'Rooftop 360'
];

function LandingPage() {
  return (
    <LandingContainer>
      <Header>
        <Logo>Society Unlocked</Logo>
        <SignInLink to="/dashboard">Sign In</SignInLink>
      </Header>

      <HeroSection>
        <HeroContent>
          <HeroTitle>Creators fuel culture.</HeroTitle>
          <HeroSubtitle>Get rewarded for it.</HeroSubtitle>
          <CTAButton to="/apply">
            Apply to Join
            <ArrowRight size={20} />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsGrid>
          <StepCard>
            <StepIcon>
              <Users size={32} />
            </StepIcon>
            <StepTitle>Apply</StepTitle>
            <StepDescription>
              Submit your creator profile and get vetted by our team
            </StepDescription>
          </StepCard>
          <StepCard>
            <StepIcon>
              <Star size={32} />
            </StepIcon>
            <StepTitle>Create</StepTitle>
            <StepDescription>
              Attend exclusive events and create amazing content
            </StepDescription>
          </StepCard>
          <StepCard>
            <StepIcon>
              <Gift size={32} />
            </StepIcon>
            <StepTitle>Earn Perks</StepTitle>
            <StepDescription>
              Get free meals, priority access, and exclusive drops
            </StepDescription>
          </StepCard>
        </StepsGrid>
      </HowItWorksSection>

      <SocialProofSection>
        <VenueLogos>
          {venues.map((venue, index) => (
            <VenueLogo key={index}>{venue}</VenueLogo>
          ))}
        </VenueLogos>
      </SocialProofSection>

      <Footer>
        <FooterContent>
          <FooterLinks>
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
          </FooterLinks>
          <InstagramLink href="https://instagram.com/societyunlocked" target="_blank">
            <Instagram size={16} />
            @SocietyUnlocked
          </InstagramLink>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
}

export default LandingPage; 