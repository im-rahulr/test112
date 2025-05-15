document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const playButton = document.getElementById('playButton');
  const backButtons = document.querySelectorAll('.back-button');
  const dashboardOptions = document.querySelectorAll('.option');
  const sections = document.querySelectorAll('.section');
  
  // Play button click event
  playButton.addEventListener('click', function() {
    showSection('dashboard');
  });
  
  // Back buttons click events
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      showSection('dashboard');
    });
  });
  
  // Dashboard option click events
  dashboardOptions.forEach(option => {
    option.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      showSection(target);
    });
  });
  
  // Function to show a specific section
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Add animation class
      targetSection.style.animation = 'none';
      targetSection.offsetHeight; // Trigger reflow
      targetSection.style.animation = 'fadeIn 0.5s ease forwards';
    }
  }
}); 