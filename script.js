const root = document.documentElement;
const body = document.body;
const saved = JSON.parse(localStorage.getItem("ulfahPortfolio") || "{}");
const mouse = { x: 0, y: 0, nx: 0, ny: 0 };

const defaults = {
  fullName: "ulfah nuhaa",
  title: "Student",
  about: "I am a student building a confident path into technology, design, and problem solving. This portfolio is ready for my story, projects, certifications, achievements, and future opportunities.",
  education: "School, program, subjects, clubs, and learning milestones can be added here.",
  experience: "Leadership roles, volunteering, internships, competitions, or school activities.",
  certifications: "Add certificates, online courses, workshops, and training achievements.",
  achievements: "Awards, recognitions, competition results, and proud milestones.",
  email: "ulfah@example.com",
  phone: "+60 00-000 0000",
  location: "Malaysia",
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
  skillOne: "HTML",
  skillTwo: "CSS",
  skillThree: "JavaScript",
  skillFour: "UI Design",
  skillFive: "Problem Solving",
  skillSix: "Teamwork",
  projectOneTitle: "Smart Study Dashboard",
  projectOneDesc: "A customizable student dashboard concept for goals, subjects, tasks, and progress.",
  projectTwoTitle: "Interactive Portfolio",
  projectTwoDesc: "A futuristic personal website with design controls, animations, and 3D effects.",
  projectThreeTitle: "Creative Tech Journal",
  projectThreeDesc: "A digital learning journal for experiments, notes, achievements, and reflections."
};

function persist() {
  localStorage.setItem("ulfahPortfolio", JSON.stringify(saved));
}

function setCssVar(name, value) {
  root.style.setProperty(`--${name}`, value);
}

function applySavedState() {
  Object.entries(saved.content || {}).forEach(([key, value]) => {
    document.querySelectorAll(`[data-edit="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });

  Object.entries(saved.colors || {}).forEach(([key, value]) => {
    setCssVar(key, value);
    document.querySelectorAll(`[data-color="${key}"]`).forEach((input) => {
      input.value = value;
    });
  });

  Object.entries(saved.fonts || {}).forEach(([key, value]) => {
    setCssVar(`${key}-font`, value);
    document.querySelectorAll(`[data-font-target="${key}"]`).forEach((select) => {
      select.value = value;
    });
  });

  if (saved.theme) {
    body.dataset.theme = saved.theme;
    document.getElementById("themeSelect").value = saved.theme;
  }

  if (saved.background) {
    body.dataset.background = saved.background;
    document.getElementById("backgroundSelect").value = saved.background;
  }

  if (saved.dark) body.classList.add("dark-mode");

  if (saved.photo) {
    document.getElementById("profilePhoto").innerHTML = `<img src="${saved.photo}" alt="Uploaded profile photo">`;
  }
}

function initEffects() {
  ["glow", "glass", "lighting", "parallax", "cursor"].forEach((effect) => {
    const enabled = saved.effects?.[effect] ?? true;
    body.classList.toggle(`effect-${effect}`, enabled);
    const input = document.querySelector(`[data-effect="${effect}"]`);
    if (input) input.checked = enabled;
  });
}

function setupEditing() {
  document.querySelectorAll("[data-edit]").forEach((node) => {
    const key = node.dataset.edit;
    node.title = "Click to edit";
    node.addEventListener("click", (event) => {
      if (!document.getElementById("editorPanel").classList.contains("open")) return;
      event.preventDefault();
      node.contentEditable = "true";
      node.focus();
    });
    node.addEventListener("blur", () => {
      node.contentEditable = "false";
      saved.content = saved.content || {};
      saved.content[key] = node.textContent.trim() || defaults[key] || "";
      persist();
    });
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        node.blur();
      }
    });
  });

  document.getElementById("editorToggle").addEventListener("click", () => {
    document.getElementById("editorPanel").classList.toggle("open");
  });

  document.getElementById("resetContent").addEventListener("click", () => {
    saved.content = {};
    saved.photo = "";
    persist();
    Object.entries(defaults).forEach(([key, value]) => {
      document.querySelectorAll(`[data-edit="${key}"]`).forEach((node) => {
        node.textContent = value;
      });
    });
    document.getElementById("profilePhoto").innerHTML = "<span>UN</span>";
  });
}

function setupControls() {
  document.getElementById("themeSelect").addEventListener("change", (event) => {
    saved.theme = event.target.value;
    body.dataset.theme = event.target.value;
    persist();
  });

  document.getElementById("backgroundSelect").addEventListener("change", (event) => {
    saved.background = event.target.value;
    body.dataset.background = event.target.value;
    persist();
  });

  document.querySelectorAll("[data-color]").forEach((input) => {
    input.addEventListener("input", () => {
      saved.colors = saved.colors || {};
      saved.colors[input.dataset.color] = input.value;
      setCssVar(input.dataset.color, input.value);
      persist();
    });
  });

  document.querySelectorAll("[data-font-target]").forEach((select) => {
    select.addEventListener("change", () => {
      saved.fonts = saved.fonts || {};
      saved.fonts[select.dataset.fontTarget] = select.value;
      setCssVar(`${select.dataset.fontTarget}-font`, select.value);
      persist();
    });
  });

  document.querySelectorAll("[data-effect]").forEach((input) => {
    input.addEventListener("change", () => {
      saved.effects = saved.effects || {};
      saved.effects[input.dataset.effect] = input.checked;
      body.classList.toggle(`effect-${input.dataset.effect}`, input.checked);
      persist();
    });
  });

  document.getElementById("modeToggle").addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    saved.dark = body.classList.contains("dark-mode");
    persist();
  });

  document.getElementById("photoInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      saved.photo = reader.result;
      document.getElementById("profilePhoto").innerHTML = `<img src="${reader.result}" alt="Uploaded profile photo">`;
      persist();
    };
    reader.readAsDataURL(file);
  });
}

function setupNavigation() {
  const nav = document.querySelector(".nav-shell");
  document.querySelector(".nav-toggle").addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", open);
  });

  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links].map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-42% 0px -52% 0px" });
  sections.forEach((section) => observer.observe(section));
}

function setupMotion() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

  document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.nx = event.clientX / window.innerWidth - 0.5;
    mouse.ny = event.clientY / window.innerHeight - 0.5;
    const cursor = document.querySelector(".cursor");
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll(".magnetic").forEach((node) => {
    node.addEventListener("mousemove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      node.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    node.addEventListener("mouseleave", () => {
      node.style.transform = "";
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  window.addEventListener("scroll", () => {
    if (!body.classList.contains("effect-parallax")) return;
    document.querySelector(".ambient-layer").style.transform = `translateY(${window.scrollY * -0.04}px)`;
  }, { passive: true });
}

function setupResume() {
  document.getElementById("downloadResume").addEventListener("click", () => {
    const get = (key) => document.querySelector(`[data-edit="${key}"]`)?.textContent.trim() || defaults[key] || "";
    const resume = [
      get("fullName"),
      get("title"),
      "",
      "About",
      get("about"),
      "",
      "Education",
      get("education"),
      "",
      "Skills",
      [...document.querySelectorAll(".skill-pill")].map((item) => item.textContent.trim()).join(", "),
      "",
      "Projects",
      `${get("projectOneTitle")} - ${get("projectOneDesc")}`,
      `${get("projectTwoTitle")} - ${get("projectTwoDesc")}`,
      `${get("projectThreeTitle")} - ${get("projectThreeDesc")}`,
      "",
      "Certifications",
      get("certifications"),
      "",
      "Experience",
      get("experience"),
      "",
      "Achievements",
      get("achievements"),
      "",
      "Contact",
      `${get("email")} | ${get("phone")} | ${get("location")}`
    ].join("\n");

    const blob = new Blob([resume], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ulfah-nuhaa-resume.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

function createRenderer(canvas) {
  if (!window.THREE || !canvas) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}

function initHeroScene() {
  const canvas = document.getElementById("hero-avatar");
  const renderer = createRenderer(canvas);
  if (!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 7;

  const group = new THREE.Group();
  scene.add(group);
  const material = new THREE.MeshStandardMaterial({
    color: 0xbdefff,
    metalness: 0.45,
    roughness: 0.18,
    wireframe: false
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 2), material);
  group.add(core);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff2b3d, wireframe: true, transparent: true, opacity: 0.58 });
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3 + i * 0.25, 0.012, 12, 120), ringMaterial);
    ring.rotation.x = Math.PI / (2.4 + i * 0.3);
    ring.rotation.y = i * 0.75;
    group.add(ring);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const light = new THREE.PointLight(0x18c964, 2.2, 20);
  light.position.set(3, 4, 6);
  scene.add(light);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    resize();
    group.rotation.y += 0.008 + mouse.nx * 0.004;
    group.rotation.x += 0.004;
    light.position.x = 3 + mouse.nx * 3;
    light.position.y = 4 - mouse.ny * 3;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function initSkillSphere() {
  const canvas = document.getElementById("skill-sphere");
  const renderer = createRenderer(canvas);
  if (!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 8;
  const group = new THREE.Group();
  scene.add(group);

  const colors = [0xff2b3d, 0xbdefff, 0x18c964, 0x6e2bbd];
  for (let i = 0; i < 42; i++) {
    const phi = Math.acos(-1 + (2 * i) / 42);
    const theta = Math.sqrt(42 * Math.PI) * phi;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: colors[i % colors.length] })
    );
    dot.position.set(2.7 * Math.cos(theta) * Math.sin(phi), 2.7 * Math.sin(theta) * Math.sin(phi), 2.7 * Math.cos(phi));
    group.add(dot);
  }

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.01, 8, 160),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.38 })
  );
  group.add(orbit);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    resize();
    group.rotation.y += 0.006;
    group.rotation.x = mouse.ny * 0.4;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function initBackgroundScene() {
  const canvas = document.getElementById("bg-scene");
  const renderer = createRenderer(canvas);
  if (!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;
  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.BufferGeometry();
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xbdefff, size: 0.025, transparent: true, opacity: 0.75 }));
  group.add(points);

  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.25 + Math.random() * 0.35),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff2b3d : 0x18c964, wireframe: true, transparent: true, opacity: 0.32 })
    );
    mesh.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    group.add(mesh);
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function animate() {
    resize();
    const visible = ["particles", "three-d"].includes(body.dataset.background);
    canvas.style.opacity = visible ? "1" : "0";
    group.rotation.y += 0.0008 + mouse.nx * 0.0008;
    group.rotation.x = mouse.ny * 0.08;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

applySavedState();
initEffects();
setupEditing();
setupControls();
setupNavigation();
setupMotion();
setupResume();
initBackgroundScene();
initHeroScene();
initSkillSphere();
