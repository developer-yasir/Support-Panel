
import React, { useState, useEffect } from 'react';

// Simple Toast Component
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        fixed: {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
        },
        toast: {
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px'
        },
        success: {
            backgroundColor: '#10B981', // Emerald 500
        },
        error: {
            backgroundColor: '#EF4444', // Red 500
        },
        warning: {
            backgroundColor: '#F59E0B', // Amber 500
        },
        info: {
            backgroundColor: '#3B82F6', // Blue 500
        },
        closeBtn: {
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            opacity: 0.8
        }
    };

    return (
        <div style={styles.fixed}>
            <div style={{ ...styles.toast, ...styles[type] }}>
                <span>{message}</span>
                <button style={styles.closeBtn} onClick={onClose}>×</button>
            </div>
            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Toast;
