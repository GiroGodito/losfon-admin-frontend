// src/components/sso-officers/OfficerForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { SSOfficer } from '../../types/sso-officer.types';
import { useToast } from '../../hooks/useToast';

interface OfficerFormProps {
  onSubmit: (data: { firstName: string; lastName: string; contactInformation: string }) => Promise<void>;
  initialData?: SSOfficer;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const OfficerForm: React.FC<OfficerFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setContactInfo(initialData.contactInformation);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showToast('Please enter the first name', 'error');
      return;
    }
    if (!lastName.trim()) {
      showToast('Please enter the last name', 'error');
      return;
    }
    if (!contactInfo.trim()) {
      showToast('Please enter contact information', 'error');
      return;
    }

    await onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contactInformation: contactInfo.trim(),
    });

    if (!initialData) {
      setFirstName('');
      setLastName('');
      setContactInfo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="First name of the officer"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Last Name"
          placeholder="Last name of the officer"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <Input
        label="Contact Information"
        placeholder="Phone number or email"
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
        required
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="glass-green"
          isLoading={isLoading}
          className="flex-1"
          disabled={!firstName.trim() || !lastName.trim() || !contactInfo.trim()}
        >
          {initialData ? 'Update Officer' : 'Add Officer'}
        </Button>
        {onCancel && (
          <Button className="flex-1" type="button" variant="glass-grey" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};