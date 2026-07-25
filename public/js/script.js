
  // Block Right-Click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Block Inspect Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  document.onkeydown = function(e) {
    if (event.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) ||
        (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) ||
        (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
      return false;
    }
  };

