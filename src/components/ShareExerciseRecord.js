import React from 'react';
import { FacebookShareButton, TwitterShareButton, LineShareButton, FacebookIcon, TwitterIcon, LineIcon } from 'react-share';
import { Box, Button, Typography } from '@mui/material';

function ShareExerciseRecord({ record }) {
    const shareUrl = `http://localhost:3000/exercise-detail/${record.id}`; // 운동 기록의 상세 페이지 URL
    const title = `${record.exerciseName} 기록을 확인하세요!`;

    return (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={40} round />
            </TwitterShareButton>
            <LineShareButton url={shareUrl} title={title}>
                <LineIcon size={40} round />
            </LineShareButton>
            {/* 필요에 따라 더 많은 SNS 공유 버튼을 추가할 수 있습니다 */}
        </Box>
    );
}

export default ShareExerciseRecord;
