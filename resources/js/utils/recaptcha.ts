declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

/**
 * Load reCAPTCHA v3 script.
 */
export function loadRecaptchaScript(siteKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.grecaptcha) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
        document.head.appendChild(script);
    });
}

/**
 * Get reCAPTCHA v3 token.
 */
export async function getRecaptchaToken(siteKey: string, action: string): Promise<string | null> {
    try {
        await loadRecaptchaScript(siteKey);

        return new Promise((resolve) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(siteKey, { action })
                    .then((token) => {
                        resolve(token);
                    })
                    .catch(() => {
                        resolve(null);
                    });
            });
        });
    } catch (error) {
        console.error('reCAPTCHA error:', error);
        return null;
    }
}

