import React from 'react';
import Button from './Button';

export default function PrimaryButton({ className = '', ...props }) {
    return (
        <Button
            variant="primary"
            className={className}
            {...props}
        />
    );
}
