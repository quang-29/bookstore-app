import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import instance from '@/axios-instance';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

const AddressScreen = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [provinceOpen, setProvinceOpen] = useState(false);
    const [districtOpen, setDistrictOpen] = useState(false);
    const [wardOpen, setWardOpen] = useState(false);

    const [detailAddress, setDetailAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);

    const { user } = useAuth();

    const GHN_TOKEN = '0130a954-16cd-11f0-ae99-b6b1c6e8a4a7';

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            const res = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                { headers: { Token: GHN_TOKEN } }
            );
            const items = res.data.data.map(p => ({
                label: p.ProvinceName,
                value: String(p.ProvinceID),
            }));
            setProvinces(items);
        } catch (err) {
            Alert.alert('Lỗi tải tỉnh', err.message);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const res = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                { province_id: parseInt(provinceId) },
                { headers: { Token: GHN_TOKEN, 'Content-Type': 'application/json' } }
            );
            const items = res.data.data.map(d => ({
                label: d.DistrictName,
                value: String(d.DistrictID),
            }));
            setDistricts(items);
            setWards([]);
            setSelectedDistrict(null);
            setSelectedWard(null);
        } catch (err) {
            Alert.alert('Lỗi tải huyện', err.message);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const res = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
                { district_id: parseInt(districtId) },
                { headers: { Token: GHN_TOKEN, 'Content-Type': 'application/json' } }
            );
            const items = res.data.data.map(w => ({
                label: w.WardName,
                value: String(w.WardCode),
            }));
            setWards(items);
            setSelectedWard(null);
        } catch (err) {
            Alert.alert('Lỗi tải xã', err.message);
        }
    };

    const handleSave = async () => {
        const provinceName = provinces.find(p => p.value === selectedProvince)?.label || '';
        const districtName = districts.find(d => d.value === selectedDistrict)?.label || '';
        const wardName = wards.find(w => w.value === selectedWard)?.label || '';

        try {
            await instance.post('/api/address/addUserAddress', {
                username: user.username,
                receiverName: name,
                phoneNumber: phone,
                isPrimary,
                province: provinceName,
                district: districtName,
                ward: wardName,
                detail: detailAddress,
            });

            Alert.alert('Thành công', 'Địa chỉ đã được lưu!');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lưu địa chỉ.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <DropDownPicker
                    open={provinceOpen}
                    value={selectedProvince}
                    items={provinces}
                    setOpen={setProvinceOpen}
                    setValue={(callback) => {
                        const value = callback(selectedProvince);
                        setSelectedProvince(value);
                        fetchDistricts(value);
                    }}
                    setItems={setProvinces}
                    placeholder="Chọn Tỉnh / Thành phố"
                    zIndex={3000}
                    style={styles.dropdown}
                />

                <DropDownPicker
                    open={districtOpen}
                    value={selectedDistrict}
                    items={districts}
                    setOpen={setDistrictOpen}
                    setValue={(callback) => {
                        const value = callback(selectedDistrict);
                        setSelectedDistrict(value);
                        fetchWards(value);
                    }}
                    setItems={setDistricts}
                    placeholder="Chọn Quận / Huyện"
                    zIndex={2000}
                    style={styles.dropdown}
                    disabled={!selectedProvince}
                />

                <DropDownPicker
                    open={wardOpen}
                    value={selectedWard}
                    items={wards}
                    setOpen={setWardOpen}
                    setValue={setSelectedWard}
                    setItems={setWards}
                    placeholder="Chọn Phường / Xã"
                    zIndex={1000}
                    style={styles.dropdown}
                    disabled={!selectedDistrict}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Số nhà, tên đường"
                    value={detailAddress}
                    onChangeText={setDetailAddress}
                />

                <TouchableOpacity
                    style={[styles.defaultButton, isPrimary && styles.defaultButtonActive]}
                    onPress={() => {
                        setIsPrimary(!isPrimary);
                        console.log(!isPrimary);
                    }}
                >
                    <Text style={[styles.defaultButtonText, isPrimary && styles.defaultButtonTextActive]}>
                        {isPrimary ? '✓ Mặc định' : 'Đặt làm mặc định'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Lưu địa chỉ</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 16,
        flexGrow: 1,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    dropdown: {
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: '#ee4d2d',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    defaultButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    defaultButtonActive: {
        backgroundColor: '#d1f2eb',
        borderColor: '#2ecc71',
    },
    defaultButtonText: {
        color: '#333',
    },
    defaultButtonTextActive: {
        color: '#2ecc71',
        fontWeight: 'bold',
    },
});
