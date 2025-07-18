import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ListItems from './ListItems';


const Titles = [
    "📝 Record the dismissible tutorial",
    "📺 Leave a like on the video",
    "💬 Check YouTube comments",
    "🎨 Design the thumbnail",
    "📤 Upload new reel to Instagram",
    "🔔 Schedule reminder for tomorrow",
    "📚 Read 10 pages of a book",
    "🎧 Edit podcast audio",
    "🛒 Buy snacks for recording",
    "📅 Plan next week’s content",
    "🚀 Publish the video at 6 PM",
    "📥 Respond to DMs on Twitter",
    "💡 Brainstorm video ideas",
    "✅ Review task checklist",
    "📦 Order new mic from Amazon",
];


export interface TaskInterface {
    title: string;
    index: number;
}

const Task: TaskInterface[] = Titles.map((title, index) => ({ index, title }));


const SwipToDelete = () => {
    const [tasks, setTasks] = useState(Task);
    const { styles } = useStyles(stylesheet);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Task</Text>
            <ScrollView style={{ flex: 1 }}>
                {tasks.map((task) => (
                    <ListItems task={task} key={task.index} />
                ))}
            </ScrollView>
        </View>
    )
}

export default SwipToDelete

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        // borderWidth:2
    },
    title: {
        fontSize: 60,
        marginVertical: 20,
        paddingLeft: '5%',
    }
}))
