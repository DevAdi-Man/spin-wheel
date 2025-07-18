import { StyleSheet, View } from 'react-native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import {
    useLinkBuilder,
    useTheme,
} from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();
    const { styles } = useStyles(stylesheet);
    const insert = useSafeAreaInsets();
    return (
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: insert.bottom + 10 }}>
            <View style={styles.shadowWrapper}>
                <View style={styles.tabBar}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <PlatformPressable
                                key={route.key}
                                href={buildHref(route.name, route.params)}
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.tabBarItems}
                            >
                                <Text style={{ color: isFocused ? colors.primary : colors.text }}>
                                    {label}
                                </Text>
                            </PlatformPressable>
                        );
                    })}
                </View>
            </View>
        </View>);
};

export default TabBar;

const stylesheet = createStyleSheet(theme => ({
    shadowWrapper: {
        backgroundColor: 'transparent', // Can be theme-based
        borderRadius: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: theme.colors.bgDark,
        paddingVertical: 15,
        borderRadius: 25,
        overflow: 'hidden',
    },
    tabBarItems: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

