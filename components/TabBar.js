
import React from "react";
import { View, StyleSheet } from "react-native";
import { withTheme, Caption, Appbar, TouchableRipple, Colors, Surface } from 'react-native-paper';


// https://dev.to/hrastnik/lets-create-a-custom-animated-tab-bar-with-react-native-3496
class TabBar extends React.PureComponent {
    render() {
        const {
            renderIcon,
            getLabelText,
            onTabPress,
            onTabLongPress,
            getAccessibilityLabel,
            navigation,
        } = this.props;

        const { colors } = this.props.theme;

        const { routes, index: activeRouteIndex } = navigation.state;

        return (
            <Surface style={{ elevation: 2 }}>
                <Appbar.Header style={[styles.container, { backgroundColor: colors.primary }]}>
                    {routes.map((route, routeIndex) => {
                        const isRouteActive = routeIndex === activeRouteIndex;
                        const tintColor = isRouteActive ? colors.accent : Colors.white;
                        return (
                            <TouchableRipple
                                key={routeIndex}
                                style={[styles.tabButton, isRouteActive ? { borderBottomWidth: 3,  borderBottomColor: colors.accent } : false ]}
                                rippleColor={Colors.white}
                                underlayColor={Colors.white}
                                borderless={true}
                                onPress={() => {
                                    onTabPress({ route });
                                }}
                                onLongPress={() => {
                                    onTabLongPress({ route });
                                }}
                                accessibilityLabel={getAccessibilityLabel({ route })}
                            >
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {renderIcon({ route, focused: isRouteActive, tintColor })}

                                    <Caption style={{ color: tintColor, textAlign: 'center', fontSize: 10, margin: 0, padding: 0 }}>{getLabelText({ route })}</Caption>
                                </View>
                            </TouchableRipple>
                        );
                    })}
                </Appbar.Header>
            </Surface>
           
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    tabButton: { 
        flex: 1, 
        justifyContent: "center", 
        margin: 0,
        padding: 0,
        alignItems: "center"
    }
});

export default withTheme(TabBar);