function showContent(section) {
    // Hide all content sections
    document.querySelectorAll('.content > div').forEach(div => {
        div.classList.remove('active');
    });
    // Show the selected content section
    document.querySelector('.' + section).classList.add('active');
}
