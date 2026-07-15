(function($) {
  $.fn.simpleFullpage = function(options) {
    // 사용자 정의 옵션과 기본 옵션 병합
    const settings = $.extend({
      sectionSelector: 'section',   // 각 섹션을 선택할 셀렉터
      duration: 800,                // 전체 페이지 전환 지속 시간(ms)
      easing: 'ease',               // 전환 효과(easing)
      keyboard: true,               // 키보드 방향키 사용 여부
      touch: true,                  // 모바일 터치 스와이프 사용 여부
      parallax: true,               // 패럴럭스 배경 효과 여부
      parallaxRatio: 1,             // 배경이 따라오는 비율 (작을수록 느림)
      navigation: true,             // 내비게이션 추가 여부
      arrows: true,                 // 이전 / 다음 버튼 활성화 여부
      autoplay: false,
      autoplaySpeed: 5000,
      onLeave: function(prevIndex, nextIndex) {},  // 이동 직전 호출
      afterLoad: function(index) {},                // 이동 완료 후 호출
      on: {} // ✅ 사용자 정의 이벤트 객체 추가
    }, options);

    const $container = this; // 전체 페이지 래퍼 (예: #wrap)
    const $sections = $container.find(settings.sectionSelector); // 모든 섹션
    let isScrolling = false;   // 전환 중 중복 입력 방지용 플래그
    let touchStartY = 0;       // 터치 시작 Y 좌표 저장용
    let currentIndex = 0;      // 현재 활성화된 섹션 인덱스
    let autoplayTimer = null;

    // 초기 활성화 상태 설정
    $sections.removeClass('active');
    $sections.eq(currentIndex).addClass('active');
    $container.css({
      transition: `transform ${settings.duration}ms ${settings.easing}`
    });

    // ✅ 내비게이션 생성
    let $navDots;
    if (settings.navigation) {
      $navDots = $('<div class="fp-nav"></div>');
      $sections.each(function(i) {
        const $dot = $(`<div class="fp-dot" data-index="${i}"></div>`);
        if (i === 0) $dot.addClass('active');
        $navDots.append($dot);
      });
      $container.append($navDots);

      // 도트 클릭 시 이동
      $navDots.on('click', '.fp-dot', function() {
        const target = parseInt($(this).attr('data-index'));
        moveTo(target);
      });
    }

    // ✅ 이전/다음버튼
    let $prevBtn, $nextBtn;
    if (settings.arrows) {
      $prevBtn = $('<button class="fp-arrow fp-prev">↑</button>');
      $nextBtn = $('<button class="fp-arrow fp-next">↓</button>');

      $arrowWrap = $('<div class="fp-arrows"></div');

      $arrowWrap.append($prevBtn, $nextBtn);

      $container.append($arrowWrap);

      $prevBtn.on('click', () => moveTo(currentIndex - 1));
      $nextBtn.on('click', () => moveTo(currentIndex + 1));
    }

    // 🔽 섹션 이동 함수
    function moveTo(index) {
      // 유효한 범위 & 중복 스크롤 방지
      if (index < 0 || index >= $sections.length || isScrolling) return;

      if (typeof settings.onLeave === 'function') {
        settings.onLeave(currentIndex, index);
      }

      isScrolling = true;
      const height = window.innerHeight;// 브라우저 높이
      const moveY = -index * height;     // 이동할 Y 위치 계산

      // ✅ 현재 섹션 기준 index → 이전 섹션: index - 1, 다음 섹션: index + 1
      // 하지만 실제 코드에서는 따로 해당 섹션 DOM을 직접 사용하지 않고,
      // 인덱스 차이를 이용한 계산만 수행합니다.

      // 전체 페이지 이동
      if (!settings.parallax) {
        $container.css({
          transform: `translateY(${moveY}px)`,
          transition: `transform ${settings.duration}ms ${settings.easing}`
        });
      }

      // 활성 섹션 class 갱신
      $sections.removeClass('active');
      $sections.eq(index).addClass('active');

      // 내비게이션 도트 업데이트
      if (settings.navigation) {
        $navDots.find('.fp-dot').removeClass('active');
        $navDots.find(`.fp-dot[data-index="${index}"]`).addClass('active');
      }

      // 패럴럭스 효과 처리
      if (settings.parallax) {
        $sections.each(function(i, el) {
          const $bg = $(el);//.find('.parallax-bg');
          const sectionOffset = index;// - i; // 현재 이동하는 섹션과의 거리

          // 기본 이동 거리
          const baseY = sectionOffset * settings.parallaxRatio * height;

          let bgY;         // 실제 translateY 적용값
          let bgDuration;  // 배경 전환 시간

          if (i === index) {
            bgY = -sectionOffset * settings.parallaxRatio * height;
            bgDuration = settings.duration * 0.5;
          } else {
            // ✅ 나머지 섹션의 배경 → 느리게 기본 속도로 이동
            settings.easing = 'ease-in-out';
            bgY = -sectionOffset * settings.parallaxRatio * height;
            bgDuration = settings.duration;
          }

          $bg.css({
            // transform: `translateY(${bgY}px)`,
            transform: `translate3d(0px, ${bgY}px, 0px)`,
            transition: `transform ${bgDuration}ms ${settings.easing}`
          });
        });
      }

      // 인덱스 갱신
      currentIndex = index;

      // 애니메이션 후 다시 스크롤 가능하게
      setTimeout(() => {
        isScrolling = false;
      }, settings.duration);

      console.log('d : '+settings.duration);

      $container.one('transitionend', function() {
        if (typeof settings.afterLoad === 'function') {
          settings.afterLoad(currentIndex);
        }
      });
    }

    // 🔽 마우스 휠 이벤트
    $container.on('wheel', function(e) {
      if (isScrolling) return;
      const delta = e.originalEvent.deltaY;

      if (delta > 0) moveTo(currentIndex + 1); // 아래로 스크롤 → 다음 섹션
      else if (delta < 0) moveTo(currentIndex - 1); // 위로 스크롤 → 이전 섹션
    });

    // 🔽 키보드 방향키 이벤트
    if (settings.keyboard) {
      $(document).on('keydown.simpleFullpage', function(e) {
        if (isScrolling) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') moveTo(currentIndex + 1); // ↓ → 다음
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') moveTo(currentIndex - 1); // ↑ → 이전
      });
    }

    // 🔽 모바일 터치 이벤트
    if (settings.touch) {
      $container.on('touchstart', function(e) {
        touchStartY = e.originalEvent.touches[0].clientY;
      });

      $container.on('touchend', function(e) {
        if (isScrolling) return;

        const touchEndY = e.originalEvent.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;

        if (diffY > 50) moveTo(currentIndex + 1); // 스와이프 ↑ → 다음 섹션
        else if (diffY < -50) moveTo(currentIndex - 1); // 스와이프 ↓ → 이전 섹션
      });
    }

    function init() {
      clearInterval(autoplayTimer);
      isScrolling = false;
      currentIndex = 0;
      $sections.removeClass('active');
      $sections.eq(currentIndex).addClass('active');

      if (settings.navigation && $navDots) {
        $navDots.find('.fp-dot').removeClass('active');
        $navDots.find(`.fp-dot[data-index="${currentIndex}"]`).addClass('active');
      }

      if (!settings.parallax) {
        $container.css({
          transform: `translateY(${moveY}px)`,
          transition: `transform ${settings.duration}ms ${settings.easing}`
        });
      }

      if (typeof settings.afterLoad === 'function') {
        settings.afterLoad(currentIndex);
      }

      // ✅ on.init 호출
      if (typeof settings.on.init === 'function') {
        settings.on.init.call($container[0]);
      }

      if (settings.autoplay) {
        autoplayTimer = setInterval(() => {
          moveTo(currentIndex + 1);
        }, settings.autoplaySpeed);
      }
    }

    init();

    // 🔚 API 반환
    return {
      moveTo,
      init
    };
  };
})(jQuery);
