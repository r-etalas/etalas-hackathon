import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormGroup,
    FormControlLabel,
    Alert,
    Snackbar,
    InputAdornment,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { createBrowserClient } from '@supabase/ssr';
import type { UserRole } from '@/types/supabase';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    created_at: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member' as UserRole,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Gagal mengambil data pengguna', 'error');
            return;
        }

        setUsers(data || []);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setNewUserData({
            name: '',
            email: '',
            password: '',
            role: 'member',
        });
        setOpenDialog(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setNewUserData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setOpenDialog(true);
    };

    const handleDeleteUser = async (userId: string) => {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            showSnackbar('Gagal menghapus pengguna', 'error');
            return;
        }

        showSnackbar('Pengguna berhasil dihapus', 'success');
        fetchUsers();
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSaveUser = async () => {
        if (!newUserData.email || !newUserData.name || (!selectedUser && !newUserData.password)) {
            showSnackbar('Mohon lengkapi semua field yang diperlukan', 'error');
            return;
        }

        try {
            if (selectedUser) {
                // Update existing user
                const { error } = await supabase
                    .from('users')
                    .update({
                        name: newUserData.name,
                        role: newUserData.role,
                    })
                    .eq('id', selectedUser.id);

                if (error) {
                    console.error('Error updating user:', error);
                    showSnackbar(`Gagal memperbarui pengguna: ${error.message}`, 'error');
                    return;
                }
                showSnackbar('Pengguna berhasil diperbarui', 'success');
                setOpenDialog(false);
                fetchUsers();
            } else {
                // Check if this is the first admin
                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('role')
                    .eq('role', 'admin')
                    .limit(1);

                const isFirstAdmin = !existingUsers || existingUsers.length === 0;

                // Create new user
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: newUserData.email,
                    password: newUserData.password,
                    options: {
                        data: {
                            name: newUserData.name,
                            role: newUserData.role,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                });

                if (signUpError) {
                    console.error('Error signing up user:', signUpError);
                    showSnackbar(`Gagal mendaftarkan pengguna: ${signUpError.message}`, 'error');
                    return;
                }

                if (data.user) {
                    let profileError;

                    if (isFirstAdmin && newUserData.role === 'admin') {
                        // Use the create_first_admin function for the first admin
                        const { error } = await supabase.rpc('create_first_admin');
                        profileError = error;
                    } else {
                        // Regular user creation
                        const { error } = await supabase
                            .from('users')
                            .insert([
                                {
                                    id: data.user.id,
                                    email: newUserData.email,
                                    name: newUserData.name,
                                    role: newUserData.role,
                                }
                            ]);
                        profileError = error;
                    }

                    if (profileError) {
                        console.error('Error creating user profile:', profileError);
                        showSnackbar(`Gagal membuat profil pengguna: ${profileError.message}`, 'error');
                        return;
                    }
                    showSnackbar('Pengguna berhasil ditambahkan dan email konfirmasi telah dikirim', 'success');
                    setOpenDialog(false);
                    fetchUsers();
                } else {
                    showSnackbar('Gagal membuat pengguna: Tidak ada data user yang diterima', 'error');
                    return;
                }
            }
        } catch (error: unknown) {
            console.error('Error saving user:', error);
            const errorMessage = error instanceof Error ? error.message :
                typeof error === 'object' && error && 'message' in error ? (error as { message: string }).message :
                    'Terjadi kesalahan yang tidak diketahui';
            showSnackbar(`Gagal menyimpan pengguna: ${errorMessage}`, 'error');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Manajemen Pengguna</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddUser}
                >
                    Tambah Pengguna Baru
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nama</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Tanggal Dibuat</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditUser(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '40%',
                        minWidth: '400px', // Untuk memastikan dialog tidak terlalu kecil di layar mobile
                    }
                }}
            >
                <DialogTitle>
                    {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nama"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                            fullWidth
                            required
                            disabled={!!selectedUser}
                        />
                        {!selectedUser && (
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={newUserData.password}
                                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newUserData.role === 'admin'}
                                        onChange={(e) => setNewUserData({
                                            ...newUserData,
                                            role: e.target.checked ? 'admin' : 'member'
                                        })}
                                    />
                                }
                                label="Admin"
                            />
                        </FormGroup>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Batal</Button>
                    <Button variant="contained" onClick={handleSaveUser}>Simpan</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement; 