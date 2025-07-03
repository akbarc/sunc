import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { X, Instagram, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: #111111;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #ffffff;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
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

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background: #0066ff;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #0052cc;
  }

  &:disabled {
    background: #666666;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666666;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #333333;
  }

  span {
    padding: 0 1rem;
  }
`;

const InstagramButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 39, 67, 0.3);
  }
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  color: #0066ff;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
  color: #666666;
  font-size: 0.9rem;
`;

const SignUpLink = styled.button`
  background: none;
  border: none;
  color: #0066ff;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

function AuthModal({ isOpen, onClose, onSwitchToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Signed in successfully!');
    onClose();
    reset();
    setIsLoading(false);
  };

  const handleInstagramLogin = () => {
    toast.success('Redirecting to Instagram...');
    // In a real app, this would redirect to Instagram OAuth
  };

  const handleForgotPassword = () => {
    toast.success('Password reset email sent!');
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <ModalTitle>Sign In</ModalTitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Email</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
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
            </InputWrapper>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>

          <ForgotLink type="button" onClick={handleForgotPassword}>
            Forgot password?
          </ForgotLink>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <InstagramButton onClick={handleInstagramLogin}>
          <Instagram size={16} />
          Log in with Instagram
        </InstagramButton>

        <SignUpPrompt>
          Don't have an account?{' '}
          <SignUpLink type="button" onClick={onSwitchToSignUp}>
            Apply to join
          </SignUpLink>
        </SignUpPrompt>
      </ModalContent>
    </Modal>
  );
}

export default AuthModal; 