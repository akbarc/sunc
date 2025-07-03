import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ArrowLeft, Check, Gift, Star, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ApplicationContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BenefitsColumn = styled.div`
  background: #111111;
  padding: 2rem;
  border-radius: 12px;
  height: fit-content;
`;

const BenefitsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #0066ff;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0, 102, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid #0066ff;
`;

const BenefitIcon = styled.div`
  color: #0066ff;
`;

const BenefitText = styled.span`
  font-weight: 500;
`;

const FormColumn = styled.div`
  background: #111111;
  padding: 2rem;
  border-radius: 12px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #ffffff;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }

  &.error {
    border-color: #ff4444;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }

  &.error {
    border-color: #ff4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }

  &.error {
    border-color: #ff4444;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background: ${props => props.disabled ? '#666666' : '#0066ff'};
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #0052cc;
    transform: translateY(-2px);
  }
`;

const RequiredField = styled.span`
  color: #ff4444;
  margin-left: 0.25rem;
`;

function ApplicationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Application submitted successfully!');
    navigate('/apply/success');
  };

  return (
    <ApplicationContainer>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </BackButton>
        <PageTitle>Apply to Join</PageTitle>
      </Header>

      <ContentGrid>
        <BenefitsColumn>
          <BenefitsTitle>What You'll Get</BenefitsTitle>
          <BenefitsList>
            <BenefitItem>
              <BenefitIcon>
                <Gift size={20} />
              </BenefitIcon>
              <BenefitText>Free meals at exclusive venues</BenefitText>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon>
                <Star size={20} />
              </BenefitIcon>
              <BenefitText>Priority access to events</BenefitText>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon>
                <Users size={20} />
              </BenefitIcon>
              <BenefitText>Exclusive drops and perks</BenefitText>
            </BenefitItem>
          </BenefitsList>
        </BenefitsColumn>

        <FormColumn>
          <FormTitle>Creator Profile</FormTitle>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>
                Full Name<RequiredField>*</RequiredField>
              </Label>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                className={errors.fullName ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.fullName && <ErrorMessage>{errors.fullName.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Email<RequiredField>*</RequiredField>
              </Label>
              <Input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Phone Number<RequiredField>*</RequiredField>
              </Label>
              <Input
                {...register('phone', { required: 'Phone number is required' })}
                className={errors.phone ? 'error' : ''}
                placeholder="(555) 123-4567"
              />
              {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Instagram Handle<RequiredField>*</RequiredField>
              </Label>
              <Input
                {...register('instagram', { required: 'Instagram handle is required' })}
                className={errors.instagram ? 'error' : ''}
                placeholder="@yourhandle"
              />
              {errors.instagram && <ErrorMessage>{errors.instagram.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                TikTok Handle
              </Label>
              <Input
                {...register('tiktok')}
                placeholder="@yourhandle"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                YouTube Channel
              </Label>
              <Input
                {...register('youtube')}
                placeholder="Your channel URL"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Follower Count<RequiredField>*</RequiredField>
              </Label>
              <Select
                {...register('followerCount', { required: 'Follower count is required' })}
                className={errors.followerCount ? 'error' : ''}
              >
                <option value="">Select your follower count</option>
                <option value="1k-5k">1K - 5K</option>
                <option value="5k-10k">5K - 10K</option>
                <option value="10k-25k">10K - 25K</option>
                <option value="25k-50k">25K - 50K</option>
                <option value="50k-100k">50K - 100K</option>
                <option value="100k+">100K+</option>
              </Select>
              {errors.followerCount && <ErrorMessage>{errors.followerCount.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Content Category<RequiredField>*</RequiredField>
              </Label>
              <Select
                {...register('contentCategory', { required: 'Content category is required' })}
                className={errors.contentCategory ? 'error' : ''}
              >
                <option value="">Select your content category</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="food">Food & Dining</option>
                <option value="fashion">Fashion</option>
                <option value="travel">Travel</option>
                <option value="entertainment">Entertainment</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </Select>
              {errors.contentCategory && <ErrorMessage>{errors.contentCategory.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                City<RequiredField>*</RequiredField>
              </Label>
              <Input
                {...register('city', { required: 'City is required' })}
                className={errors.city ? 'error' : ''}
                placeholder="Your city"
              />
              {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Why do you want to join?<RequiredField>*</RequiredField>
              </Label>
              <TextArea
                {...register('motivation', { 
                  required: 'Please tell us why you want to join',
                  minLength: {
                    value: 50,
                    message: 'Please provide at least 50 characters'
                  }
                })}
                className={errors.motivation ? 'error' : ''}
                placeholder="Tell us about your passion for creating content and why you'd be a great fit..."
              />
              {errors.motivation && <ErrorMessage>{errors.motivation.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                What's your best content piece?<RequiredField>*</RequiredField>
              </Label>
              <Input
                {...register('bestContent', { required: 'Please share your best content piece' })}
                className={errors.bestContent ? 'error' : ''}
                placeholder="URL to your best post/video"
              />
              {errors.bestContent && <ErrorMessage>{errors.bestContent.message}</ErrorMessage>}
            </FormGroup>

            <SubmitButton 
              type="submit" 
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </SubmitButton>
          </Form>
        </FormColumn>
      </ContentGrid>
    </ApplicationContainer>
  );
}

export default ApplicationPage; 