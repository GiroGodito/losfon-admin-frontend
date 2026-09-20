// // src/components/sso-officers/OfficerForm.tsx
// import React, { useState, useEffect } from 'react';
// import { Button } from '../common/Button';
// import { Input } from '../common/Input';
// import type { SSOfficer } from '../../types/sso-officer.types';
// import { useToast } from '../../hooks/useToast';

// interface OfficerFormProps {
//   onSubmit: (data: { firstName: string; lastName: string; contactInformation: string }) => Promise<void>;
//   initialData?: SSOfficer;
//   isLoading?: boolean;
//   onCancel?: () => void;
// }

// export const OfficerForm: React.FC<OfficerFormProps> = ({
//   onSubmit,
//   initialData,
//   isLoading = false,
//   onCancel,
// }) => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [contactInfo, setContactInfo] = useState('');
//   const { showToast } = useToast();

//   useEffect(() => {
//     if (initialData) {
//       setFirstName(initialData.firstName);
//       setLastName(initialData.lastName);
//       setContactInfo(initialData.contactInformation);
//     }
//   }, [initialData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!firstName.trim()) {
//       showToast('Please enter the first name', 'error');
//       return;
//     }
//     if (!lastName.trim()) {
//       showToast('Please enter the last name', 'error');
//       return;
//     }
//     if (!contactInfo.trim()) {
//       showToast('Please enter contact information', 'error');
//       return;
//     }

//     await onSubmit({
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       contactInformation: contactInfo.trim(),
//     });

//     if (!initialData) {
//       setFirstName('');
//       setLastName('');
//       setContactInfo('');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="First Name"
//           placeholder="First name of the officer"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           required
//         />
//         <Input
//           label="Last Name"
//           placeholder="Last name of the officer"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           required
//         />
//       </div>

//       <Input
//         label="Contact Information"
//         placeholder="Phone number or email"
//         value={contactInfo}
//         onChange={(e) => setContactInfo(e.target.value)}
//         required
//       />

//       <div className="flex gap-3">
//         <Button
//           type="submit"
//           variant="glass-green"
//           isLoading={isLoading}
//           className="flex-1"
//           disabled={!firstName.trim() || !lastName.trim() || !contactInfo.trim()}
//         >
//           {initialData ? 'Update Officer' : 'Add Officer'}
//         </Button>
//         {onCancel && (
//           <Button className="flex-1" type="button" variant="glass-grey" onClick={onCancel}>
//             Cancel
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// };



// src/components/sso-officers/OfficerForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { SSOfficer } from '../../types/sso-officer.types';

interface OfficerFormProps {
  onSubmit: (data: { firstName: string; lastName: string; contactInformation: string }) => Promise<void>;
  initialData?: SSOfficer;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  contactInformation?: string;
}

// ✅ PHONE-ONLY VALIDATOR (no email)
const isValidPhone = (value: string): boolean => {
  const cleaned = value.replace(/[\s\-()]/g, '');
  if (!cleaned) return false;

  return (
    /^\+\d{7,15}$/.test(cleaned) ||   // international format
    /^09\d{9}$/.test(cleaned) ||      // PH mobile (0917…)
    /^\d{7,15}$/.test(cleaned)        // generic digits 7–15 length
  );
};

export const OfficerForm: React.FC<OfficerFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setContactInfo(initialData.contactInformation);
    }
  }, [initialData]);

  // ✅ Single source of truth for validation
  const validate = (values: {
    firstName: string;
    lastName: string;
    contactInformation: string;
  }): FormErrors => {
    const next: FormErrors = {};

    if (!values.firstName.trim()) {
      next.firstName = 'First name is required';
    } else if (values.firstName.trim().length < 2) {
      next.firstName = 'First name must be at least 2 characters';
    }

    if (!values.lastName.trim()) {
      next.lastName = 'Last name is required';
    } else if (values.lastName.trim().length < 2) {
      next.lastName = 'Last name must be at least 2 characters';
    }

    if (!values.contactInformation.trim()) {
      next.contactInformation = 'Contact number is required';
    } else if (!isValidPhone(values.contactInformation)) {
      next.contactInformation = 'Enter a valid phone number (e.g. 09171234567)';
    }

    return next;
  };

  // ✅ Compute validity on every render (memoized)
  const isFormValid = useMemo(() => {
    const validationErrors = validate({
      firstName,
      lastName,
      contactInformation: contactInfo,
    });
    return Object.keys(validationErrors).length === 0;
  }, [firstName, lastName, contactInfo]);

  const runValidation = (nextValues?: {
    firstName?: string;
    lastName?: string;
    contactInformation?: string;
  }) => {
    const values = {
      firstName: nextValues?.firstName ?? firstName,
      lastName: nextValues?.lastName ?? lastName,
      contactInformation: nextValues?.contactInformation ?? contactInfo,
    };
    setErrors(validate(values));
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runValidation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched so errors show if somehow invalid
    setTouched({ firstName: true, lastName: true, contactInformation: true });

    const validationErrors = validate({
      firstName,
      lastName,
      contactInformation: contactInfo,
    });
    setErrors(validationErrors);

    // Safety net — button should already be disabled, but just in case
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        contactInformation: contactInfo.trim(),
      });

      if (!initialData) {
        setFirstName('');
        setLastName('');
        setContactInfo('');
        setErrors({});
        setTouched({});
      }
    } catch (err) {
      // parent handles the toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (field: keyof FormErrors) =>
    touched[field] ? errors[field] : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            First Name <span className="text-red-400">*</span>
          </label>
          <Input
            placeholder="First name of the officer"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              runValidation({ firstName: e.target.value });
            }}
            onBlur={() => handleBlur('firstName')}
            error={showError('firstName')}
            fullWidth
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Last Name <span className="text-red-400">*</span>
          </label>
          <Input
            placeholder="Last name of the officer"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              runValidation({ lastName: e.target.value });
            }}
            onBlur={() => handleBlur('lastName')}
            error={showError('lastName')}
            fullWidth
          />
        </div>
      </div>

      {/* Contact Number */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Contact Number <span className="text-red-400">*</span>
        </label>
        <Input
          type="tel"
          inputMode="tel"
          placeholder="e.g. 09171234567"
          value={contactInfo}
          onChange={(e) => {
            setContactInfo(e.target.value);
            runValidation({ contactInformation: e.target.value });
          }}
          onBlur={() => handleBlur('contactInformation')}
          error={showError('contactInformation')}
          fullWidth
        />
        {!showError('contactInformation') && (
          <p className="mt-1.5 text-xs text-gray-500">
            Accepted formats: 09171234567, 9171234567, or +639171234567
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {/* ✅ Button is disabled until the form is fully valid */}
        <Button
          type="submit"
          variant="glass-green"
          isLoading={isLoading || isSubmitting}
          disabled={!isFormValid || isSubmitting}
          className="flex-1"
        >
          {initialData ? 'Update Officer' : 'Add Officer'}
        </Button>
        {onCancel && (
          <Button
            className="flex-1"
            type="button"
            variant="glass-grey"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};