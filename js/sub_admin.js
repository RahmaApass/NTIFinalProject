 
        
        document.getElementById('toggleBtn').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });

        // Navigation between sections
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('nav a').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.form-container, .reviews-container, .profile-container').forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show the selected section
                const targetId = this.getAttribute('href').substring(1);
                if (targetId === 'dashboard') {
                    // Show default dashboard view if needed
                } else {
                    document.getElementById(targetId).style.display = 'block';
                }
            });
        });

        // Show add product by default
       

        // Check if user is logged in and is admin
        const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'signin.html';
        }

        function logout() {
            localStorage.removeItem('CurrentUser');
            window.location.href = 'signin.html';
        }

        // Form submission
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('تم إضافة المنتج بنجاح!');
            this.reset();
        });




 