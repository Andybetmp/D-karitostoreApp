import { ReactElement } from 'react';
import {
  Card,
  Stack,
  Avatar,
  CardMedia,
  Typography,
  AvatarGroup,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { TrendingItem } from 'data/trending-items';
import { stringAvatar } from 'helpers/string-avatar';

const SlideItem = ({ trendingItem }: { trendingItem: TrendingItem }): ReactElement => {
  return (
    <Card sx={{ bgcolor: 'background.default', height: 1 }}>
      <CardMedia image={trendingItem.imgsrc} sx={{ height: 187 }} />
      <CardContent sx={{ height: 115 }}>
        <Typography variant="body1" color="common.white" fontWeight={600} mb={1.5} noWrap>
          {trendingItem.name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" color="text.primary" mb={1.5}>
          <Typography variant="body2">Demanda</Typography>
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {trendingItem.popularity}%
          </Typography>
        </Stack>
        <Stack gap={1.5}>
          <LinearProgress variant="determinate" color="info" value={trendingItem.popularity} />
          <AvatarGroup max={4}>
            {trendingItem.users.map((user, idx) => (
              <Avatar key={idx} {...stringAvatar(user)} />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SlideItem;
