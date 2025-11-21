import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import IconifyIcon from '../../components/base/IconifyIcon';
import { useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../routes/paths';
import Image from '../../components/base/Image';
import { useAuth } from '../../context/AuthContext';
const logoWithText = '/Logo-with-text.png';

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (localError) setLocalError(null);
    if (error) clearError();
  };

  const handleSubmit = async () => {
    try {
      setLocalError(null);
      await login({
        email: formData.email,
        password: formData.password
      });
      navigate(rootPaths.dashboard);
    } catch (err: any) {
      console.error('Login failed:', err);
      // Intentar obtener el mensaje de error específico del backend
      const backendError = err.response?.data?.message || err.message || 'Error de conexión';
      setLocalError(`Error: ${backendError}`);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box component="figure" mb={5} mx="auto" textAlign="center">
        <Link href={rootPaths.homeRoot}>
          <Image src={logoWithText} alt="logo with text" height={60} />
        </Link>
      </Box>
      <Paper
        sx={{
          py: 6,
          px: { xs: 5, sm: 7.5 },
        }}
      >
        <Stack justifyContent="center" gap={5}>
          <Typography variant="h3" textAlign="center" color="text.secondary">
            Log In
          </Typography>
          <Typography variant="h6" fontWeight={500} textAlign="center" color="text.primary">
            Don’t have an account?{' '}
            <Link href="/authentication/sign-up" underline="none">
              Sign up
            </Link>
          </Typography>

          {(error || localError) && (
            <Typography color="error" textAlign="center">
              {localError || error}
            </Typography>
          )}

          <TextField
            variant="filled"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
          />
          <TextField
            variant="filled"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormGroup sx={{ ml: 1, width: 'fit-content' }}>
            <FormControlLabel
              control={<Checkbox />}
              label="Keep me signed in"
              sx={{
                color: 'text.secondary',
              }}
            />
          </FormGroup>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              fontWeight: 'fontWeightRegular',
            }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
          <Divider />
          <Typography textAlign="center" color="text.secondary" variant="body1">
            Or sign in using:
          </Typography>
          <Stack gap={1.5} direction="row" justifyContent="space-between">
            <Button
              startIcon={<IconifyIcon icon="flat-color-icons:google" />}
              variant="outlined"
              fullWidth
              sx={{
                fontSize: 'subtitle2.fontSize',
                fontWeight: 'fontWeightRegular',
              }}
            >
              Google
            </Button>
            <Button
              startIcon={<IconifyIcon icon="logos:facebook" />}
              variant="outlined"
              fullWidth
              sx={{
                fontSize: 'subtitle2.fontSize',
                fontWeight: 'fontWeightRegular',
              }}
            >
              Facebook
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default Login;
