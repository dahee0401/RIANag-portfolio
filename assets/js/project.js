// ✅ 프로젝트 기본 정보 데이터
const project = {
    title: [
        'Go deep\nDive in\nWatch on',
        'Trendy\nPersonalized\nVisual\nCatregorizing',
        'Enjoy\nA new\nHappiness',
        'Simple\n& Easy\nConsulting',
        'Concise\nApproach\nFor customer',
        'Find style\nShare\nThe space',
        'Convenient\nIndexing\nFor developers',
        'Brand with\nVisual\nEmphasis',
        'Touch\nOptimized\nTablet UI',
    ],
    subTitle: [
        'CGV\nON MOBILE',
        'LOTTE\nDUTY FREE',
        'HOME&\nSHOPPING',
        'KB Kookmin\nCard TABLET',
        'HYUNDAI\nDUTY F REE',
        'HYUNDAI\nLIVART',
        'SKT\nT ID ADMIN',
        'CJ\nSEAFOOD',
        'WOORI BANK\nTABLET BRUNCH',
    ],
    industry: [
        'Commerce',
        'Commerce',
        'Commerce',
        'Finance',
        'Commerce',
        'Commerce',
        'Telecommunication',
        'Commerce',
        'Finance',
    ],
    date: [
        'July, 2025',
        '2019 - In Preogress',
        '2021 - In Progress',
        'September, 2022',
        '2021 - In Progress',
        'January, 2021',
        'September, 2021',
        'December, 2022',
        'March, 2020',
    ],
    type: [
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Tablet Web & App',
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Mobile Web&App/PC Web/ Admin',
        'UI/UX Design/Mobile Web&App/PC Web',
        'UI/UX Design/Mobile Web&App/Tablet',
    ],
};

// ✅ 전역 Swiper 인스턴스 및 정보 DOM 캐싱
let mainSwiper = null;
let thumbSwiper = null;

const $industry = $('.industry');
const $date = $('.date');
const $type = $('.type');

// ✅ 모바일 여부 판단 유틸 함수
function isMobile() {
    return $(window).width() <= 768;
}
// ✅ 타이틀 및 서브타이틀 텍스트 업데이트 함수
function updateTitleAndSubtitle(index) {
    const $title = $('.title');
    const $subtitle = $('.sub-title');
    const $projectInfo = $('.project-info');

    // ✅ 타이틀 구성
    let titleText = project.title[index];

    // 👉 index === 1일 때 PC에선 Visual + Catregorizing 합치기
    if (index === 1 && !isMobile()) {
        titleText = titleText.replace('Personalized\nVisual', 'Personalized Visual');
    }

    const titleLines = titleText
        .split('\n')
        .map((line) => `<li><span>${line}</span></li>`)
        .join('');

    $title.html(`<ul>${titleLines}</ul>`);

    // ✅ 서브타이틀 구성
    const raw = project.subTitle[index];
    let subtitleHTML = '';

    if (window.innerWidth <= 768) {
        const compactLine = raw.replace(/\n/g, ' ').replace(/\s*&\s*/g, '&');
        subtitleHTML = `<ul><li><span>${compactLine}</span></li></ul>`;
    } else {
        const lines = raw.split('\n').filter(Boolean);
        const subtitleLines = lines.map((line) => `<li><span>${line}</span></li>`).join('');
        subtitleHTML = `<ul>${subtitleLines}</ul>`;
    }
    $subtitle.html(subtitleHTML);

    // ✅ project-info는 PC에서만 적용
    const isPC = window.innerWidth > 768;
    if (isPC) {
        $projectInfo.show();
        $projectInfo.find('li').css({
            opacity: 0,
            transform: 'translateY(100%)',
            transition: 'none',
        });
    } else {
        $projectInfo.hide();
    }

    // ✅ GSAP 애니메이션
    setTimeout(() => {
        const titleSpans = gsap.utils.toArray('.title span');
        const subtitleSpans = gsap.utils.toArray('.sub-title span');

        gsap.fromTo(
            titleSpans,
            {
                opacity: 0,
                y: 200,
                force3D: true,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                stagger: 0.15,
                ease: 'power2.out',
                force3D: true,
            }
        );

        gsap.fromTo(
            subtitleSpans,
            {
                opacity: 0,
                y: 200,
                force3D: true,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                stagger: 0.15,
                ease: 'power2.out',
                force3D: true,
            }
        );

        if (isPC) {
            $projectInfo.find('li').each(function (i) {
                $(this).css({
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'all 1.1s ease-in-out',
                    transitionDelay: i * 0.1 + 's',
                });
            });
        }
    }, 0);
}

// ✅ 이미지 or 비디오 경로에 따라 .image-viewer 업데이트 함수
function updateImageViewer(mediaPath) {
    const $viewer = $('.image-viewer');
    $viewer.empty();

    if (mediaPath.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = mediaPath;

        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'auto');

        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.pointerEvents = 'none';

        // iOS 대응용 play 보장
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {});
        });

        $viewer.append(video);
    } else {
        const img = document.createElement('img');
        img.src = mediaPath;
        img.alt = 'project image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        $viewer.append(img);
    }
}

// ✅ 리스트 hover/scroll 시 image-viewer 이미지 변경 및 active 처리 함수
function initListItemBehavior() {
    const $listItems = $('.list-item');
    const $viewerImg = $('.image-viewer img');
    let ticking = false;

    // 스크롤 감지
    $('.project-viewer-scrollable').on('scroll', function () {
        const $this = $(this);
        if (!ticking) {
            requestAnimationFrame(() => {
                let minDiff = Infinity;
                let $closest = null;
                const containerTop = $this.offset().top;
                const containerHeight = $this.height();
                const centerY = containerTop + containerHeight / 2;

                $listItems.each(function () {
                    const $el = $(this);
                    const offset = $el.offset().top;
                    const height = $el.outerHeight();
                    const middle = offset + height / 2;
                    const diff = Math.abs(centerY - middle);
                    if (diff < minDiff) {
                        minDiff = diff;
                        $closest = $el;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // 마우스 올렸을 때
    $listItems.on('mouseenter', function () {
        $listItems.removeClass('active');
        $(this).addClass('active');
        const imgSrc = $(this).data('image');
        if (imgSrc) updateImageViewer(imgSrc); // ✅
    });

    // ❗ 마우스가 list 바깥으로 나갔을 때
    $('.project-viewer-scrollable').on('mouseleave', function () {
        $listItems.removeClass('active');
    });
}

// ✅ 썸네일 터치 드래그로 메인 슬라이드 이동 + 클릭 구분
let dragStartX = 0;
let dragDiff = 0;
let isDragging = false;

document.querySelectorAll('.thumbnail').forEach((thumb) => {
    thumb.addEventListener('touchstart', (e) => {
        dragStartX = e.touches[0].clientX; // 터치 시작 X좌표 저장
        isDragging = false;
    });

    thumb.addEventListener('touchmove', (e) => {
        const moveX = e.touches[0].clientX;
        dragDiff = moveX - dragStartX;

        // 일정 거리 이상 움직이면 드래그로 판단
        if (Math.abs(dragDiff) > 10) {
            isDragging = true;
        }
    });

    thumb.addEventListener('touchend', (e) => {
        if (isDragging) {
            e.preventDefault();

            // 드래그 방향에 따라 메인 슬라이드 이동
            if (dragDiff > 0) {
                mainSwiper.slidePrev();
            } else {
                mainSwiper.slideNext();
            }
        } else {
            const link = e.currentTarget.getAttribute('href');
            if (link) window.location.href = link;
        }
    });
});

// 각 슬라이드 인덱스에 대응되는 배경색 배열 (data-swiper-slide-index 기준)
const bgColors = ['#1d1617', '#EA1236', '#8DDFAF', '#A5BFE1', '#253146', '#1D251C', '#215EC3', '#5FBF8C', '#089BD0'];

function applySlideBackgrounds() {
    document.querySelectorAll('.main-swiper .swiper-slide').forEach((el) => {
        const index = el.dataset.swiperSlideIndex;
        if (index !== undefined && bgColors[index]) {
            el.style.backgroundColor = bgColors[index];
        }
    });
}

let previousIndex = 0;

function animateActiveThumbnail(index) {
    const $active = $('.thumbnail-swiper .swiper-slide-active').find('img, video');
    if (!$active.length) return;

    const direction = index > previousIndex ? 'right' : 'left';
    previousIndex = index;

    const fromX = direction === 'right' ? 80 : -80;

    gsap.fromTo(
        $active,
        {
            x: fromX,
            opacity: 0,
            scale: 0.96,
        },
        {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: 'expo.out',
        }
    );
}

// ✅ 프로젝트 swiper 초기화 및 썸네일 관리 함수
function initSwiper() {
    // 👉 썸네일 Swiper 초기화
    thumbSwiper = new Swiper('.thumbnail-swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 33,
        centeredSlides: true,
        slideToClickedSlide: true,
        allowTouchMove: false,
    });

    // 👉 메인 Swiper 초기화
    mainSwiper = new Swiper('.main-swiper', {
        loop: true,
        slidesPerView: 1,
        touchEventsTarget: 'container',
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        },
        thumbs: {
            swiper: thumbSwiper, // 썸네일과 연동
        },

        on: {
            init() {
                const index = this.realIndex;
                updateTitleAndSubtitle(index);

                $industry.text(project.industry[index]);
                $date.text(project.date[index]);
                $type.text(project.type[index]);

                setTimeout(() => {
                    mainSwiper.update();
                    applySlideBackgrounds();
                    thumbSwiper.slideToLoop(index, 0);
                }, 100);
            },
            slideChange() {
                const index = this.realIndex;
                updateTitleAndSubtitle(index);

                $industry.text(project.industry[index]);
                $date.text(project.date[index]);
                $type.text(project.type[index]);

                thumbSwiper.update();
                thumbSwiper.slideToLoop(index, 0);

                if (isMobile()) {
                    animateActiveThumbnail(index);
                }
            },
        },
    });
}

// ✅ swiper 제거 함수
function destroySwiper() {
    if (mainSwiper) {
        mainSwiper.destroy(true, true);
        mainSwiper = null;
    }
    if (thumbSwiper) {
        thumbSwiper.destroy(true, true);
        thumbSwiper = null;
    }
}

// ✅ 전체 레이아웃 핸들링 (모바일/PC 구분)
function handleLayout() {
    if (isMobile()) {
        destroySwiper();
        initSwiper();
    } else {
        destroySwiper();
        initFullpage();
    }
}

// ✅ fullpage.js 초기화 함수
function initFullpage() {
    const totalSections = $('.project-section').length;
    const formattedTotal = totalSections < 10 ? '0' + totalSections : totalSections;

    $('#section_wrap').simpleFullpage({
        duration: 800,
        easing: 'easeInOutExpo',
        parallax: true,
        keyboard: true,
        touch: true,
        navigation: false,
        on: {
            init() {
                $('.fp-navi').remove();
                $('.fp-arrows').prepend(`
                        <div class="fp-navi">
                            <span>01</span>
                            <em>${formattedTotal}</em>
                        </div>
                    `);
            },
        },
        afterLoad(index) {
            const current = index + 1;
            $('.fp-navi span').text(current < 10 ? '0' + current : current);

            const $thumbnailViewer = $('.thumbnail-viewer');
            const $thumbnails = $('.thumbnail');
            const thumbHeight = $thumbnails.outerHeight();

            gsap.to($thumbnailViewer, {
                y: -(index * thumbHeight),
                duration: 0.6,
                ease: 'ease',
            });

            $thumbnails.removeClass('active').eq(index).addClass('active');

            $('.industry').text(project.industry[index]);
            $('.date').text(project.date[index]);
            $('.type').text(project.type[index]);
            updateTitleAndSubtitle(index);

            if (index === totalSections - 1) {
                setTimeout(() => {
                    const plugin = $('#section_wrap').data('simpleFullpage');
                    if (plugin && typeof plugin.destroy === 'function') {
                        plugin.destroy();
                        $('body, html').css('overflow', 'auto');
                    }
                }, 500);
            }
        },
    });
}

// ✅ 리스트 JSON 로딩 및 리스트 동적 생성
function loadProjectList() {
    const $lists = $('.lists');
    $.getJSON('./assets/data/projectList.json', function (data) {
        data.forEach((item) => {
            const tagsHtml = item.tags.map((tag) => `<li>${tag}</li>`).join('');
            const html = `
                <a class="list-item" data-image="${item.image}" href="${item.link || 'javascript:void(0);'}" 
                   ${item.link ? 'data-link="true"' : ''}>
                    <div class="animate-wrap">
                        <div class="animate">
                            <div class="ani-top">
                                <p>${item.title}</p>
                                <ol>${tagsHtml}</ol>
                            </div>
                            <div class="ani-bottom">
                                <p>${item.title}</p>
                                <ol>${tagsHtml}</ol>
                            </div>
                        </div>
                    </div>
                    <div class="bg-dark"></div>
                </a>
            `;
            $lists.append(html);
        });

        // ✅ data-link가 있는 list-item에 custom cursor "view" 효과 적용
        $('.list-item[data-link="true"]').each(function () {
            customCursorEffect($(this), 'view');
        });

        if (!isMobile()) initListItemBehavior();
    });
}

// ✅ 프로젝트 뷰어 열기 함수
function openProjectViewer() {
    $('.project-viewer').addClass('active');
    const firstImgSrc = $('.list-item').first().data('image');
    updateImageViewer(firstImgSrc);
    if (window.lenis) window.lenis.stop();
    $('.project-viewer').on('wheel touchmove', function (e) {
        e.stopPropagation();
    });
}

// ✅ 프로젝트 뷰어 닫기 함수
function closeProjectViewer() {
    $('.project-viewer').removeClass('active');
    if (window.lenis) window.lenis.start();
    $('.project-viewer').off('wheel touchmove');
}

// ✅ 전체 초기화
$(window).on('load', function () {
    loadProjectList();
    handleLayout();
});

let resizeTimer;
$(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        handleLayout();
    }, 200);
});

// ✅ 이벤트 바인딩
$(document).on('click', '.project-list-button', openProjectViewer);
$(document).on('click', '.project-viewer .close', closeProjectViewer);
