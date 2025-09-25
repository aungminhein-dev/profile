// Portfolio JavaScript for Interactive Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  const navbar = document.getElementById("mainNav");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
      if (scrollIndicator) {
        scrollIndicator.style.opacity = "0";
      }
    } else {
      navbar.classList.remove("scrolled");
      if (scrollIndicator) {
        scrollIndicator.style.opacity = "1";
      }
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Animate skill bars when they come into view
  const skillBars = document.querySelectorAll(".skill-progress");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px",
  };

  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const width = skillBar.getAttribute("data-width") || "0%";
        // support both CSS animation and width transition approaches
        skillBar.style.setProperty("--target-width", width);
        // ensure transition triggers reliably
        requestAnimationFrame(() => {
          skillBar.style.width = width;
          skillBar.classList.add("animate");
        });
        // observe only once per bar
        skillObserver.unobserve(skillBar);
      }
    });
  }, observerOptions);

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });

  // Animate timeline items when they come into view
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Set initial state for timeline items
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = `opacity 0.6s ease ${
      index * 0.2
    }s, transform 0.6s ease ${index * 0.2}s`;
    timelineObserver.observe(item);
  });

  // Animate project cards on scroll
  const projectCards = document.querySelectorAll(".project-card");
  const projectObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  projectCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    projectObserver.observe(card);
  });

  // Contact form handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const subject = this.querySelectorAll('input[type="text"]')[1].value;
      const message = this.querySelector("textarea").value;

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification(
          "Thank you! Your message has been sent successfully.",
          "success"
        );
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : "fa-info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#28a745"
                : type === "error"
                ? "#dc3545"
                : "#17a2b8"
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

    notification.querySelector(".notification-content").style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

    notification.querySelector(".notification-close").style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
      });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Parallax effect for hero section (disabled for performance)
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.style.transform = "";
  }

  // Add typing effect to hero title
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Add hover effects to social links
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.1)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add click effects to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Mobile menu close on link click
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  // Project modal enhancements
  const modalProjectCards = document.querySelectorAll(
    '.project-card[data-bs-toggle="modal"]'
  );
  modalProjectCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Add click animation
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });

  // Modal show/hide events
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("show.bs.modal", function () {
      // Add fade-in animation to modal content
      const modalContent = this.querySelector(".modal-content");
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-20px)";

      setTimeout(() => {
        modalContent.style.transition = "all 0.3s ease";
        modalContent.style.opacity = "1";
        modalContent.style.transform = "translateY(0)";
      }, 10);
    });

    modal.addEventListener("hide.bs.modal", function () {
      // Add fade-out animation
      const modalContent = this.querySelector(".modal-content");
      modalContent.style.transition = "all 0.2s ease";
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-20px)";
    });
  });
});

// Utility function for smooth scrolling
function smoothScrollTo(target, duration = 1000) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - 80;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}
