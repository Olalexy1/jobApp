import { Text, View } from "react-native";

import styles from "./screenheader.style";

interface ScreenHeaderProps {
    title: string
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
};

export default ScreenHeader;