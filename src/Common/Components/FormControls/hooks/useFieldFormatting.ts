import { useCallback, useMemo } from 'react';
import { FieldFormat, FieldFormatResult } from '../EnhancedTextField.types';

export const useFieldFormatting = (format?: FieldFormat) => {
  // Formatting functions
  const formatters = useMemo(() => ({
    phone: (value: string, pattern: string = '(###) ###-####'): string => {
      const digits = value.replace(/\D/g, '');
      let result = pattern;
      
      for (let i = 0; i < digits.length && result.includes('#'); i++) {
        result = result.replace('#', digits[i]);
      }
      
      return result.replace(/#/g, '');
    },

    currency: (value: string, currency: string = 'USD', locale: string = 'en-US'): string => {
      const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(numValue)) return value;
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(numValue);
    },

    date: (value: string, format: string = 'MM/DD/YYYY'): string => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      return format
        .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
        .replace('DD', String(date.getDate()).padStart(2, '0'))
        .replace('YYYY', String(date.getFullYear()))
        .replace('YY', String(date.getFullYear()).slice(-2));
    },

    time: (value: string, format: string = 'HH:MM'): string => {
      const time = new Date(`2000-01-01T${value}`);
      if (isNaN(time.getTime())) return value;
      
      return format
        .replace('HH', String(time.getHours()).padStart(2, '0'))
        .replace('MM', String(time.getMinutes()).padStart(2, '0'))
        .replace('SS', String(time.getSeconds()).padStart(2, '0'));
    },

    number: (value: string, locale: string = 'en-US'): string => {
      const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(numValue)) return value;
      
      return new Intl.NumberFormat(locale).format(numValue);
    },

    uppercase: (value: string): string => {
      return value.toUpperCase();
    },

    lowercase: (value: string): string => {
      return value.toLowerCase();
    },

    capitalize: (value: string): string => {
      return value.replace(/\b\w/g, char => char.toUpperCase());
    }
  }), []);

  // Unformatting functions
  const unformatters = useMemo(() => ({
    phone: (value: string): string => {
      return value.replace(/\D/g, '');
    },

    currency: (value: string): string => {
      return value.replace(/[^\d.-]/g, '');
    },

    date: (value: string): string => {
      // Return as-is for date unformatting
      return value;
    },

    time: (value: string): string => {
      // Return as-is for time unformatting
      return value;
    },

    number: (value: string): string => {
      return value.replace(/[^\d.-]/g, '');
    },

    uppercase: (value: string): string => {
      return value;
    },

    lowercase: (value: string): string => {
      return value;
    },

    capitalize: (value: string): string => {
      return value;
    }
  }), []);

  // Format value
  const formatValue = useCallback((value: string): string => {
    if (!format || !value) return value;

    try {
      switch (format.type) {
        case 'phone':
          return formatters.phone(value, format.pattern);

        case 'currency':
          return formatters.currency(value, format.currency, format.locale);

        case 'date':
          return formatters.date(value, format.dateFormat);

        case 'time':
          return formatters.time(value, format.timeFormat);

        case 'number':
          return formatters.number(value, format.locale);

        case 'uppercase':
          return formatters.uppercase(value);

        case 'lowercase':
          return formatters.lowercase(value);

        case 'capitalize':
          return formatters.capitalize(value);

        case 'custom':
          if (format.formatter) {
            return format.formatter(value);
          }
          return value;

        default:
          return value;
      }
    } catch (error) {
      console.warn('Formatting error:', error);
      return value;
    }
  }, [format, formatters]);

  // Unformat value
  const unformatValue = useCallback((value: string): string => {
    if (!format || !value) return value;

    try {
      switch (format.type) {
        case 'phone':
          return unformatters.phone(value);

        case 'currency':
          return unformatters.currency(value);

        case 'date':
          return unformatters.date(value);

        case 'time':
          return unformatters.time(value);

        case 'number':
          return unformatters.number(value);

        case 'uppercase':
          return unformatters.uppercase(value);

        case 'lowercase':
          return unformatters.lowercase(value);

        case 'capitalize':
          return unformatters.capitalize(value);

        case 'custom':
          if (format.unformatter) {
            return format.unformatter(value);
          }
          return value;

        default:
          return value;
      }
    } catch (error) {
      console.warn('Unformatting error:', error);
      return value;
    }
  }, [format, unformatters]);

  // Format with result information
  const formatWithResult = useCallback((value: string): FieldFormatResult => {
    const originalValue = value;
    const formattedValue = formatValue(value);
    const wasFormatted = formattedValue !== originalValue;

    return {
      formattedValue,
      wasFormatted,
      originalValue
    };
  }, [formatValue]);

  // Check if value needs formatting
  const needsFormatting = useCallback((value: string): boolean => {
    if (!format || !value) return false;

    const formatted = formatValue(value);
    return formatted !== value;
  }, [format, formatValue]);

  // Get format preview
  const getFormatPreview = useCallback((value: string): string => {
    return formatValue(value);
  }, [formatValue]);

  return {
    formatValue,
    unformatValue,
    formatWithResult,
    needsFormatting,
    getFormatPreview
  };
}; 