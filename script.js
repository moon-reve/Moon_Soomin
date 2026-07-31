(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const intro = document.querySelector("#intro");
  const mascot = document.querySelector("#mascot");
  const bubble = document.querySelector("#mascot-bubble");
  const progress = document.querySelector(".scroll-progress span");
  const nav = document.querySelector("#nav");
  const cursor = document.querySelector(".custom-cursor");
  const cursorLabel = cursor.querySelector("span");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  let guideMode = false;
  let bubbleTimer = 0;
  let activeSection = null;
  let statsPlayed = false;

  const state = {
    pointer: { x: innerWidth * .5, y: innerHeight * .5 },
    target: { x: innerWidth * .73, y: innerHeight * .28 },
    pos: { x: innerWidth * .73, y: innerHeight * .28 },
    velocity: { x: 0, y: 0 },
    scale: 1,
    tick: 0
  };

  const sectionPositions = new Map([
    ["top", [.72, .25]],
    ["about", [.81, .45]],
    ["work", [.14, .43]],
    ["toolkit", [.78, .48]],
    ["faq", [.82, .58]],
    ["contact", [.72, .36]]
  ]);

  const idleLines = [
    "저는 커서를 보고 있어요 👀",
    "좋은 제품은 작은 질문에서 시작해요.",
    "이 페이지의 색도 바꿀 수 있어요.",
    "궁금한 프로젝트가 있나요?",
    "끝까지 가면 연락처가 나와요!"
  ];

  function showBubble(message, duration = 2800) {
    clearTimeout(bubbleTimer);
    bubble.textContent = message;
    mascot.classList.add("has-bubble");
    bubbleTimer = setTimeout(() => mascot.classList.remove("has-bubble"), duration);
  }

  function closeIntro(withGuide) {
    guideMode = withGuide;
    intro.classList.add("is-hidden");
    body.classList.remove("is-locked");
    mascot.classList.add("is-ready");
    setTimeout(() => intro.remove(), 750);
    showBubble(withGuide ? "좋아요! 제가 포인트를 알려드릴게요." : "필요할 때 저를 눌러주세요!", 3400);
  }

  body.classList.add("is-locked");
  document.querySelector("#start-guide").addEventListener("click", () => closeIntro(true));
  document.querySelector("#skip-guide").addEventListener("click", () => closeIntro(false));

  // The intro is optional: the first scroll/swipe/scroll-key dismisses it.
  // This keeps the cinematic opening without making the page feel frozen.
  const dismissIntroOnScroll = () => {
    if (!intro.classList.contains("is-hidden")) closeIntro(false);
  };
  intro.addEventListener("wheel", dismissIntroOnScroll, { once: true, passive: true });
  intro.addEventListener("touchmove", dismissIntroOnScroll, { once: true, passive: true });
  addEventListener("keydown", event => {
    if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) dismissIntroOnScroll();
  });

  document.querySelector("#mascot-button").addEventListener("click", () => {
    const line = idleLines[Math.floor(Math.random() * idleLines.length)];
    showBubble(line, 3200);
    mascot.animate([
      { transform: mascot.style.transform },
      { transform: `${mascot.style.transform} scale(1.18, .82)` },
      { transform: mascot.style.transform }
    ], { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)" });
  });

  function updateScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${ratio})`;
    nav.classList.toggle("is-scrolled", scrollY > 40);
  }
  addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(el);
  });

  function playStats() {
    if (statsPlayed) return;
    statsPlayed = true;
    document.querySelectorAll("[data-count]").forEach(el => {
      const end = Number(el.dataset.count);
      const started = performance.now();
      const duration = 1300;
      const step = now => {
        const t = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(end * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      activeSection = entry.target;
      const id = entry.target.id || entry.target.classList[0];
      const pos = sectionPositions.get(id) || [.76, .45];
      state.target.x = innerWidth * pos[0];
      state.target.y = innerHeight * pos[1];
      mascot.classList.toggle("is-dark", entry.target.classList.contains("dark-section"));
      if (guideMode && entry.target.dataset.message) showBubble(entry.target.dataset.message, 3400);
      if (entry.target.classList.contains("work")) playStats();
    });
  }, { rootMargin: "-35% 0px -48%", threshold: 0 });
  document.querySelectorAll(".section-observer").forEach(el => sectionObserver.observe(el));

  function pointerMove(event) {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    if (finePointer) cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%,-50%)`;
  }
  addEventListener("pointermove", pointerMove, { passive: true });

  if (finePointer) {
    document.querySelectorAll("a, button, summary, [data-cursor]").forEach(el => {
      el.addEventListener("pointerenter", () => {
        const label = el.dataset.cursor || (el.tagName === "A" ? "GO" : "");
        cursorLabel.textContent = label;
        cursor.classList.toggle("is-label", Boolean(label));
      });
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-label"));
    });
  }

  function updateEyes() {
    const rect = mascot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(state.pointer.y - centerY, state.pointer.x - centerX);
    const dist = Math.min(6, Math.hypot(state.pointer.x - centerX, state.pointer.y - centerY) / 50);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    document.querySelectorAll(".eye__pupil").forEach(pupil => pupil.setAttribute("transform", `translate(${x} ${y})`));
  }

  function animateMascot() {
    if (reduceMotion) return;
    state.tick += .035;
    const pointerPull = finePointer ? .035 : 0;
    const desiredX = state.target.x + (state.pointer.x - innerWidth / 2) * pointerPull;
    const desiredY = state.target.y + (state.pointer.y - innerHeight / 2) * pointerPull + Math.sin(state.tick) * 8;
    state.velocity.x += (desiredX - state.pos.x) * .028;
    state.velocity.y += (desiredY - state.pos.y) * .028;
    state.velocity.x *= .84;
    state.velocity.y *= .84;
    state.pos.x += state.velocity.x;
    state.pos.y += state.velocity.y;
    const size = mascot.offsetWidth;
    const x = Math.max(6, Math.min(innerWidth - size - 6, state.pos.x - size / 2));
    const y = Math.max(58, Math.min(innerHeight - size - 12, state.pos.y - size / 2));
    const tilt = Math.max(-8, Math.min(8, state.velocity.x * .8));
    mascot.style.transform = `translate3d(${x}px,${y}px,0) rotate(${tilt}deg)`;
    updateEyes();
    requestAnimationFrame(animateMascot);
  }
  requestAnimationFrame(animateMascot);

  addEventListener("resize", () => {
    const id = activeSection?.id || activeSection?.classList[0] || "top";
    const pos = sectionPositions.get(id) || [.76, .45];
    state.target.x = innerWidth * pos[0];
    state.target.y = innerHeight * pos[1];
  });

  document.querySelectorAll(".theme-dock button").forEach(button => {
    button.addEventListener("click", () => {
      const themes = {
        yellow: ["#f5ee77", "245, 238, 119"],
        blue: ["#8fd4ff", "143, 212, 255"],
        pink: ["#ffb3d5", "255, 179, 213"]
      };
      const [color, rgb] = themes[button.dataset.theme];
      root.style.setProperty("--bg", color);
      root.style.setProperty("--bg-rgb", rgb);
      document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
      document.querySelectorAll(".theme-dock button").forEach(b => b.classList.toggle("is-active", b === button));
      showBubble("새로운 색도 잘 어울리죠?", 2200);
      try { localStorage.setItem("moon-theme", button.dataset.theme); } catch {
        // Storage may be unavailable in privacy-restricted browser contexts.
      }
    });
  });

  try {
    const saved = localStorage.getItem("moon-theme");
    if (saved) document.querySelector(`.theme-dock [data-theme="${saved}"]`)?.click();
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }

  document.querySelectorAll(".faq details").forEach(details => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      document.querySelectorAll(".faq details").forEach(other => { if (other !== details) other.open = false; });
    });
  });

  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("pointermove", event => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .18;
      const y = (event.clientY - rect.top - rect.height / 2) * .2;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  // The reference uses Matter.js. Each visible chip has a matching rounded
  // rigid body, so rotation, collision space and the DOM always agree.
  const physicsBox = document.querySelector("#skill-cloud");
  let physicsStarted = false;

  function startMatterPhysics() {
    if (physicsStarted) return;
    physicsStarted = true;
    if (!window.Matter) {
      physicsBox.classList.add("is-physics-fallback");
      return;
    }

    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = window.Matter;
    // 1 = normal speed. Lower this to slow the entire chip simulation.
    const PHYSICS_SPEED = .75;
    const engine = Engine.create({ enableSleeping: false });
    engine.gravity.y = 1.05;
    engine.gravity.scale = .001;
    const entries = [];
    let walls = [];

    const makeWalls = () => {
      walls.forEach(wall => Composite.remove(engine.world, wall));
      const width = physicsBox.clientWidth;
      const height = physicsBox.clientHeight;
      const thickness = 100;
      const options = { isStatic: true, restitution: .24, friction: .46, label: "boundary" };
      walls = [
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, options),
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, options),
        Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, options),
        Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, options)
      ];
      Composite.add(engine.world, walls);
    };

    makeWalls();
    const boxWidth = physicsBox.clientWidth;
    let spawnX = 24;
    let spawnY = 54;
    let rowHeight = 0;

    document.querySelectorAll("#skill-cloud button").forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (spawnX + width > boxWidth - 24) {
        spawnX = 24;
        spawnY += rowHeight + 16;
        rowHeight = 0;
      }
      const bodyState = Bodies.rectangle(spawnX + width / 2, spawnY + height / 2, width + 2, height + 2, {
        label: `chip-${index}`,
        restitution: .24,
        friction: .4,
        frictionStatic: .6,
        frictionAir: .009,
        density: .0016,
        sleepThreshold: 80,
        chamfer: { radius: Math.max(8, height * .48) }
      });
      Body.setAngle(bodyState, (Math.random() - .5) * .12);
      entries.push({ element, body: bodyState, width, height });
      Composite.add(engine.world, bodyState);
      spawnX += width + 14;
      rowHeight = Math.max(rowHeight, height);
    });

    // Native Matter mouse constraint: a body is selected only while the
    // primary button is held, and the selected body keeps colliding with all
    // other chips during the drag.
    const physicsMouse = Mouse.create(physicsBox);
    physicsMouse.pixelRatio = 1;
    // Matter prevents wheel defaults by design; remove only those listeners
    // so the page can still scroll while the pointer is over this section.
    physicsBox.removeEventListener("wheel", physicsMouse.mousewheel);
    physicsBox.removeEventListener("mousewheel", physicsMouse.mousewheel);
    physicsBox.removeEventListener("DOMMouseScroll", physicsMouse.mousewheel);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: physicsMouse,
      constraint: { stiffness: .15, damping: .22, angularStiffness: 0, render: { visible: false } }
    });
    Composite.add(engine.world, mouseConstraint);
    Events.on(mouseConstraint, "startdrag", event => {
      const active = entries.find(entry => entry.body === event.body);
      if (active) active.element.style.zIndex = "8";
    });
    Events.on(mouseConstraint, "enddrag", event => {
      const active = entries.find(entry => entry.body === event.body);
      if (active) active.element.style.zIndex = "1";
    });

    physicsBox.classList.add("is-physics-ready");
    let previousTime = performance.now();
    const update = time => {
      const delta = Math.min(32, Math.max(8, time - previousTime));
      previousTime = time;
      Engine.update(engine, delta * PHYSICS_SPEED);
      entries.forEach(({ element, body: bodyState, width, height }) => {
        const x = bodyState.position.x - width / 2;
        const y = bodyState.position.y - height / 2;
        element.style.transform = `translate3d(${x}px,${y}px,0) rotate(${bodyState.angle}rad)`;
      });
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    const resizePhysics = new ResizeObserver(() => {
      makeWalls();
      const width = physicsBox.clientWidth;
      const height = physicsBox.clientHeight;
      entries.forEach(({ body: bodyState, width: chipWidth, height: chipHeight }) => {
        const x = Math.max(chipWidth / 2 + 2, Math.min(width - chipWidth / 2 - 2, bodyState.position.x));
        const y = Math.max(chipHeight / 2 + 2, Math.min(height - chipHeight / 2 - 2, bodyState.position.y));
        Body.setPosition(bodyState, { x, y });
        Body.setSleeping(bodyState, false);
      });
    });
    resizePhysics.observe(physicsBox);
  }

  const physicsObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) startMatterPhysics();
  }, { threshold: .18 });
  physicsObserver.observe(physicsBox);

  setTimeout(() => {
    if (!intro || intro.classList.contains("is-hidden")) return;
    document.querySelector("#start-guide").focus();
  }, 400);
})();
