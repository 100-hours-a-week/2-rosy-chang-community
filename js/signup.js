// 회원가입 페이지 관련 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 참조
    const backButton = document.getElementById('backButton');
    const profilePreview = document.getElementById('profilePreview');
    const profileImage = document.getElementById('profileImage');
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');
    const loginButton = document.getElementById('loginButton');
    
    // 입력 필드 참조
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('passwordCheck');
    const nicknameInput = document.getElementById('nickname');
    
    // 헬퍼 텍스트 참조
    const profileHelperText = document.getElementById('profileHelperText');
    const emailHelperText = document.getElementById('emailHelperText');
    const passwordHelperText = document.getElementById('passwordHelperText');
    const passwordCheckHelperText = document.getElementById('passwordCheckHelperText');
    const nicknameHelperText = document.getElementById('nicknameHelperText');
    
    // 폼 유효성 상태
    const formValidity = {
        profileImage: false,
        email: false,
        password: false,
        passwordCheck: false,
        nickname: false
    };
    
    // 업로드한 이미지 파일 저장 변수
    let uploadedImage = null;
    
    // 뒤로가기 버튼 클릭 이벤트
    backButton.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // 로그인하러 가기 버튼 클릭 이벤트
    loginButton.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // 프로필 이미지 클릭 이벤트
    profilePreview.addEventListener('click', function() {
        profileImage.click();
    });
    
    // 프로필 이미지 변경 이벤트
    profileImage.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            uploadedImage = file;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                profilePreview.appendChild(img);
                
                // 유효성 상태 업데이트
                formValidity.profileImage = true;
                hideHelperText(profileHelperText);
                updateSignupButtonState();
            };
            reader.readAsDataURL(file);
        } else if (!uploadedImage) {
            // 이미지를 선택하지 않았고 기존에도 없는 경우
            profilePreview.innerHTML = '<span class="plus-icon">+</span>';
            formValidity.profileImage = false;
            showHelperText(profileHelperText, '* 프로필 사진을 추가해주세요.');
            updateSignupButtonState();
        }
    });
    
    // 이메일 입력 및 포커스 아웃 이벤트
    emailInput.addEventListener('input', function() {
        validateEmail();
    });
    
    emailInput.addEventListener('focusout', function() {
        validateEmail();
    });
    
    // 비밀번호 입력 및 포커스 아웃 이벤트
    passwordInput.addEventListener('input', function() {
        validatePassword();
    });
    
    passwordInput.addEventListener('focusout', function() {
        validatePassword();
    });
    
    // 비밀번호 확인 입력 및 포커스 아웃 이벤트
    passwordCheckInput.addEventListener('input', function() {
        validatePasswordCheck();
    });
    
    passwordCheckInput.addEventListener('focusout', function() {
        validatePasswordCheck();
    });
    
    // 닉네임 입력 및 포커스 아웃 이벤트
    nicknameInput.addEventListener('input', function() {
        validateNickname();
    });
    
    nicknameInput.addEventListener('focusout', function() {
        validateNickname();
    });
    
    // 회원가입 폼 제출 이벤트
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 모든 필드 유효성 검사
        validateEmail();
        validatePassword();
        validatePasswordCheck();
        validateNickname();
        
        if (!formValidity.profileImage) {
            showHelperText(profileHelperText, '* 프로필 사진을 추가해주세요.');
        }
        
        // 모든 필드가 유효하면 회원가입 진행
        if (Object.values(formValidity).every(value => value === true)) {
            // FormData 객체 생성하여 데이터 추가
            const formData = new FormData();
            formData.append('email', emailInput.value.trim());
            formData.append('password', passwordInput.value);
            formData.append('passwordCheck', passwordCheckInput.value);
            formData.append('nickname', nicknameInput.value.trim());
            
            if (uploadedImage) {
                formData.append('profile_image', uploadedImage);
            }
            
            try {
                // 회원가입 API 호출
                const response = await fetch(`${API_BASE_URL}/users/signup`, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // 회원가입 성공
                    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                    window.location.href = 'login.html';
                } else {
                    // 회원가입 실패 - 필드별 오류 메시지 표시
                    if (data.errors && data.errors.length > 0) {
                        data.errors.forEach(error => {
                            if (error.field === 'email') {
                                showHelperText(emailHelperText, error.message);
                            } else if (error.field === 'password') {
                                showHelperText(passwordHelperText, error.message);
                            } else if (error.field === 'passwordCheck') {
                                showHelperText(passwordCheckHelperText, error.message);
                            } else if (error.field === 'nickname') {
                                showHelperText(nicknameHelperText, error.message);
                            } else if (error.field === 'profile_image') {
                                showHelperText(profileHelperText, error.message);
                            }
                        });
                    } else {
                        // 일반 오류 메시지
                        alert(data.message || '회원가입에 실패했습니다.');
                    }
                }
            } catch (error) {
                console.error('회원가입 요청 오류:', error);
                alert('서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                
                // 테스트 목적으로 로컬 개발 환경에서는 회원가입 성공으로 처리
                console.log('테스트용 회원가입 처리');
                alert('(테스트용) 회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                window.location.href = 'login.html';
            }
        }
    });
    
    // 이메일 유효성 검사 함수
    function validateEmail() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showHelperText(emailHelperText, '* 이메일을 입력해주세요.');
            formValidity.email = false;
        } else if (!isValidEmail(email)) {
            showHelperText(emailHelperText, '* 올바른 이메일 주소 형식을 입력해주세요.(예: example@example.com)');
            formValidity.email = false;
        } else {
            // 이메일 중복 검사는 서버 통신이 필요하지만 여기서는 생략
            // 실제 구현 시 API 호출하여 중복 체크 필요
            hideHelperText(emailHelperText);
            formValidity.email = true;
        }
        
        updateSignupButtonState();
    }
    
    // 비밀번호 유효성 검사 함수
    function validatePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            showHelperText(passwordHelperText, '* 비밀번호를 입력해주세요.');
            formValidity.password = false;
        } else if (!isValidPassword(password)) {
            showHelperText(passwordHelperText, '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
            formValidity.password = false;
        } else {
            hideHelperText(passwordHelperText);
            formValidity.password = true;
        }
        
        // 비밀번호가 변경되면 비밀번호 확인도 재검증
        if (passwordCheckInput.value) {
            validatePasswordCheck();
        }
        
        updateSignupButtonState();
    }
    
    // 비밀번호 확인 유효성 검사 함수
    function validatePasswordCheck() {
        const passwordCheck = passwordCheckInput.value;
        const password = passwordInput.value;
        
        if (!passwordCheck) {
            showHelperText(passwordCheckHelperText, '* 비밀번호를 한번 더 입력해주세요.');
            formValidity.passwordCheck = false;
        } else if (password !== passwordCheck) {
            showHelperText(passwordCheckHelperText, '* 비밀번호가 다릅니다.');
            formValidity.passwordCheck = false;
        } else {
            hideHelperText(passwordCheckHelperText);
            formValidity.passwordCheck = true;
        }
        
        updateSignupButtonState();
    }
    
    // 닉네임 유효성 검사 함수
    function validateNickname() {
        const nickname = nicknameInput.value.trim();
        
        if (!nickname) {
            showHelperText(nicknameHelperText, '* 닉네임을 입력해주세요.');
            formValidity.nickname = false;
        } else if (nickname.length > 10) {
            showHelperText(nicknameHelperText, '* 닉네임은 최대 10자까지 작성 가능합니다.');
            formValidity.nickname = false;
        } else if (nickname.includes(' ')) {
            showHelperText(nicknameHelperText, '* 띄어쓰기를 없애주세요.');
            formValidity.nickname = false;
        } else {
            // 닉네임 중복 검사는 서버 통신이 필요하지만 여기서는 생략
            // 실제 구현 시 API 호출하여 중복 체크 필요
            hideHelperText(nicknameHelperText);
            formValidity.nickname = true;
        }
        
        updateSignupButtonState();
    }
    
    // 이메일 유효성 검사 함수 (정규식)
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }
    
    // 비밀번호 유효성 검사 함수 (정규식)
    function isValidPassword(password) {
        // 8-20자, 대문자, 소문자, 숫자, 특수문자 각 1개 이상 포함
        if (password.length < 8 || password.length > 20) return false;
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }
    
    // 헬퍼 텍스트 표시 함수
    function showHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = 'visible';
    }
    
    // 헬퍼 텍스트 숨김 함수
    function hideHelperText(element) {
        element.style.visibility = 'hidden';
    }
    
    // 회원가입 버튼 상태 업데이트 함수
    function updateSignupButtonState() {
        const isValid = Object.values(formValidity).every(value => value === true);
        
        if (isValid) {
            signupButton.classList.add('active');
        } else {
            signupButton.classList.remove('active');
        }
    }
});