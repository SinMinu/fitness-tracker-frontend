import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function InactivityHandler({ children }) {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const timer = useRef(null); // useRef로 timer 참조

    const resetTimer = () => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            logout();
            alert("5분 동안 활동이 없어 로그아웃되었습니다.");
            navigate('/');
        }, 5 * 60 * 1000); // 5분 타이머 설정
    };

    useEffect(() => {
        // 초기 타이머 설정
        resetTimer();

        // 이벤트 리스너 추가
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('click', resetTimer);

        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            if (timer.current) clearTimeout(timer.current);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }, [logout, navigate]);

    return <>{children}</>;
}

export default InactivityHandler;
