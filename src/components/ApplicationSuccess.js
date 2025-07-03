import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Check, Instagram, ArrowLeft } from 'lucide-react';

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SuccessCard = styled.div`
  background: #111111;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #00cc66;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: #ffffff;
`;

const SuccessTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #00cc66;
`;

const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const InstagramPrompt = styled.div`
  background: rgba(0, 102, 255, 0.1);
  border: 1px solid #0066ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InstagramTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #0066ff;
`;

const InstagramText = styled.p`
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const InstagramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #0066ff;
  color: #ffffff;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0052cc;
    transform: translateY(-1px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #333333;
  color: #ffffff;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #444444;
    transform: translateY(-1px);
  }
`;

function ApplicationSuccess() {
  return (
    <SuccessContainer>
      <SuccessCard>
        <SuccessIcon>
          <Check size={40} />
        </SuccessIcon>
        
        <SuccessTitle>Application Submitted!</SuccessTitle>
        <SuccessMessage>
          We're reviewing your profile. You'll hear from us soon.
        </SuccessMessage>

        <InstagramPrompt>
          <InstagramTitle>Stay Connected</InstagramTitle>
          <InstagramText>
            Follow @SocietyUnlocked on Instagram while you wait for updates
          </InstagramText>
          <InstagramButton 
            href="https://instagram.com/societyunlocked" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={16} />
            Follow @SocietyUnlocked
          </InstagramButton>
        </InstagramPrompt>

        <ButtonGroup>
          <HomeButton to="/">
            <ArrowLeft size={16} />
            Back to Home
          </HomeButton>
        </ButtonGroup>
      </SuccessCard>
    </SuccessContainer>
  );
}

export default ApplicationSuccess; 