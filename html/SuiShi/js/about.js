        function toggleForm() {
            const form = document.getElementById('feedbackForm');
            const thanks = document.getElementById('thanksContent');
            const isFormVisible = form.style.display !== 'none';
            
            form.style.display = isFormVisible ? 'none' : 'block';
            thanks.style.display = isFormVisible ? 'block' : 'none';
        }

        function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const authorEmail = formData.get('author-email');
            const userEmail = formData.get('email');
            const rating = formData.get('rating');
            const feedback = formData.get('feedback');

            const subject = `用户反馈（评分：${rating}星）`;
            const body = `用户邮箱：${userEmail}%0D%0A%0D%0A反馈内容：%0D%0A${feedback}`;

            try {
                const mailtoLink = `mailto:${authorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // 尝试打开邮件客户端
                window.location.href = mailtoLink;
                
                // 检测是否成功打开
                setTimeout(() => {
                    if (!document.hidden) {
                        alert('未检测到邮件客户端，请手动发送邮件至：' + authorEmail);
                    }
                }, 500);
            } catch (e) {
                alert('邮件发送失败，请检查您的邮件客户端设置');
            }
        }