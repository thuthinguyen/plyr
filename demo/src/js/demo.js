// ==========================================================================
// Plyr.io demo
// This code is purely for the https://plyr.io website
// Please see readme.md in the root or github.com/sampotts/plyr
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.shr) {
        window.shr.setup({
            count: {
                classname: 'button__count',
            },
        });
    }

    // Setup tab focus
    const tabClassName = 'tab-focus';

    // Remove class on blur
    document.addEventListener('focusout', event => {
        event.target.classList.remove(tabClassName);
    });

    // Add classname to tabbed elements
    document.addEventListener('keydown', event => {
        if (event.keyCode !== 9) {
            return;
        }

        // Delay the adding of classname until the focus has changed
        // This event fires before the focusin event
        window.setTimeout(() => {
            document.activeElement.classList.add(tabClassName);
        }, 0);
    });

    /* document.body.addEventListener('ready', function(event) {
        console.log(event);
    }); */

    // Setup the player
    const player = new window.Plyr('#player', {
        debug: true,
        title: 'View From A Blue Moon',
        iconUrl: '../dist/plyr.svg',
        keyboard: {
            global: true,
        },
        tooltips: {
            controls: true,
        },
        captions: {
            active: true,
        },
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'fullscreen',
            'pip',
            'airplay',
        ],
    });

    // Expose for testing
    window.player = player;

    // Setup type toggle
    const buttons = document.querySelectorAll('[data-source]');
    const types = {
        video: 'video',
        audio: 'audio',
        youtube: 'youtube',
        vimeo: 'vimeo',
    };
    let currentType = window.location.hash.replace('#', '');
    const historySupport = window.history && window.history.pushState;

    // Toggle class on an element
    function toggleClass(element, className, state) {
        if (element) {
            element.classList[state ? 'add' : 'remove'](className);
        }
    }

    // Set a new source
    function newSource(type, init) {
        // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
        if (!(type in types) || (!init && type === currentType) || (!currentType.length && type === types.video)) {
            return;
        }

        switch (type) {
            case types.video:
                player.source = {
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
                            type: 'video/mp4',
                        },
                    ],
                    poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
                    tracks: [
                        {
                            kind: 'captions',
                            label: 'English',
                            srclang: 'en',
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
                            default: true,
                        },
                        {
                            kind: 'captions',
                            label: 'French',
                            srclang: 'fr',
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt',
                        },
                    ],
                };

                break;

            case types.audio:
                player.source = {
                    type: 'audio',
                    title: 'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
                    sources: [
                        {
                            src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
                            type: 'audio/mp3',
                        },
                        {
                            src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
                            type: 'audio/ogg',
                        },
                    ],
                };

                break;

            case types.youtube:
                player.source = {
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: 'https://www.youtube.com/watch?v=bTqVqk7FSmY',
                            type: 'youtube',
                        },
                    ],
                };

                break;

            case types.vimeo:
                player.source = {
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: 'https://vimeo.com/76979871',
                            type: 'vimeo',
                        },
                    ],
                };

                break;

            default:
                break;
        }

        // Set the current type for next time
        currentType = type;

        // Remove active classes
        Array.from(buttons).forEach(button => toggleClass(button.parentElement, 'active', false));

        // Set active on parent
        toggleClass(document.querySelector(`[data-source="${type}"]`), 'active', true);

        // Show cite
        Array.from(document.querySelectorAll('.plyr__cite')).forEach(cite => {
            cite.setAttribute('hidden', '');
        });
        document.querySelector(`.plyr__cite--${type}`).removeAttribute('hidden');
    }

    // Bind to each button
    Array.from(buttons).forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-source');

            newSource(type);

            if (historySupport) {
                window.history.pushState({ type }, '', `#${type}`);
            }
        });
    });

    // List for backwards/forwards
    window.addEventListener('popstate', event => {
        if (event.state && 'type' in event.state) {
            newSource(event.state.type);
        }
    });

    // On load
    if (historySupport) {
        const video = !currentType.length;

        // If there's no current type set, assume video
        if (video) {
            currentType = types.video;
        }

        // Replace current history state
        if (currentType in types) {
            window.history.replaceState(
                {
                    type: currentType,
                },
                '',
                video ? '' : `#${currentType}`
            );
        }

        // If it's not video, load the source
        if (currentType !== types.video) {
            newSource(currentType, true);
        }
    }
});

// Google analytics
// For demo site (https://plyr.io) only
/* eslint-disable */
if (window.location.host === 'plyr.io') {
    (function(i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] =
            i[r] ||
            function() {
                (i[r].q = i[r].q || []).push(arguments);
            };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    window.ga('create', 'UA-40881672-11', 'auto');
    window.ga('send', 'pageview');
}
/* eslint-enable */
