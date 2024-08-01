const colors =[
    "#ff7473",
    "#fec22b",
    "#47b8e0",
    "#a5d296",
    "#c4ccd3",
    "#e062ae",
    "#e690d1",
    "#e7bcf3",
    "#7289ab",
    "#91ca8c",
    "#f49f42"
]

const bgColor = "#303135"

export const makePieChart = (sourceArr) => {
    let total = 0;
    let pinTotal = 0
    const title = "关注/总数"
    
    const chartData = sourceArr.map(it => {
        total += it.count
        if (it.is_hold === "1") {
            pinTotal = it.count
        }   
        return {
            name: it.is_hold === "0" ? "未关注" : "关注",
            value: it.count
        }
    })

    const pin = `${pinTotal}/${total}`
    return option1 = {
        backgroundColor: bgColor,
        color: colors,
        title: {
            text: '{a|'+ pin +'}\n{c|'+ title +'}',
            x: '5%',
            y: 'bottom',
            textStyle: {
                rich:{
                    a: {
                        fontSize: 38,
                        color: '#ffffff',
                    },
                    b: {
                        fontSize: 38,
                        color: '#ffffff',
                    },
                    c: {
                        fontSize: 30,
                        color: '#ffffff',
                        padding: [10, 0, 0, 0]
                    },
                }
            }
        },
        series: [{
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '50%'],
            data: chartData,
            hoverAnimation: false,
            labelLine: {
                normal: {
                    length: 10,
                    length2: 10,
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                }
            },
            label: {
                normal: {
                    rich: {
                        icon: {
                            fontSize: 16
                        },
                        name: {
                            fontSize: 14,
                            padding: [0, 10, 0, 4],
                            color: '#666666'
                        },
                        value: {
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333333'
                        }
                    }
                }
            },
        }]
    }; 
}