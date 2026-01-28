import gsap from 'gsap';

// Fade in animation
export const fadeIn = (element: Element | null, delay: number = 0) => {
    if (!element) return;

    gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power3.out' }
    );
};

// Card entrance animation (for login/register forms)
export const formCardAnimation = (container: Element | null, delay: number = 0) => {
    if (!container) return;

    const card = container;
    gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power3.out',
        }
    );
};

export const animateCards = (cards: NodeListOf<Element> | Element[]) => {
    gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.2)',
        }
    );
};

// Scale pulse animation
export const pulseScale = (element: Element | null) => {
    if (!element) return;

    gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
    });
};

// Number counter animation
export const animateNumber = (
    element: Element | null,
    endValue: number,
    duration: number = 1.5
) => {
    if (!element) return;

    const obj = { value: 0 };
    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power3.out',
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toLocaleString('th-TH');
        },
    });
};

// Modal animation
export const animateModalIn = (overlay: Element | null, content: Element | null) => {
    if (!overlay || !content) return;

    const tl = gsap.timeline();
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo(
        content,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' },
        '-=0.1'
    );

    return tl;
};

export const animateModalOut = (overlay: Element | null, content: Element | null) => {
    if (!overlay || !content) return;

    const tl = gsap.timeline();
    tl.to(content, { opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: 'power2.in' });
    tl.to(overlay, { opacity: 0, duration: 0.2 }, '-=0.1');

    return tl;
};

// Chart entrance animation
export const animateChart = (element: Element | null, delay: number = 0.5) => {
    if (!element) return;

    gsap.fromTo(
        element,
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay,
            ease: 'elastic.out(1, 0.5)',
        }
    );
};

// Page transition
export const pageTransition = (container: Element | null) => {
    if (!container) return;

    gsap.fromTo(
        container,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    );
};

// Hover effect for cards
export const createHoverEffect = (element: HTMLElement) => {
    const onEnter = () => {
        gsap.to(element, {
            y: -8,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const onLeave = () => {
        gsap.to(element, {
            y: 0,
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
        element.removeEventListener('mouseenter', onEnter);
        element.removeEventListener('mouseleave', onLeave);
    };
};
