import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Avatar } from '@rneui/themed';

type AvatarComponentProps = {
    avatar: string | undefined;
    handlePress?: () => void;
};

const AvatarBtn: React.FunctionComponent<AvatarComponentProps> = ({ avatar, handlePress }) => {
    return (
        <Avatar
            size={42}
            title={avatar}
            containerStyle={{ backgroundColor: "#407BFF", borderRadius: 8 }}
            onPress={handlePress}
        />
    )
}

export default AvatarBtn