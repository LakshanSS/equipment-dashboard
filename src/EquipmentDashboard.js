import React, {useState, useEffect} from 'react';
import CanvasJSReact from './canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function EquipmentDashboard() {

    const [data, setData] = useState([]);
    const [operational, setOperational] = useState(0);
    const [nonOperational, setNonOperational] = useState(0);
    const options = {
        animationEnabled: true,
        theme: "light2",
        axisX: {
            title: "Equipment Type",
            labelAngle: -60,
            interval: 1
        },
        axisY: {
            title: "No of devices",
            interval: 5
        },
        data: [{
            type: "column",
            dataPoints: data
        }]
    };

    useEffect(() => {
            getData();
        }, []
    );

    return (
        <section>
            <h1>Equipment Dashboard</h1><br/>
            <h3>Operational: {operational}</h3>
            <h3>Non-Operational: {nonOperational}</h3>
            <CanvasJSChart options={options}/>
        </section>
    );

    async function getData() {
        let lastRow = 0;
        let noOfOperational = 0;
        let noOfNonOperational = 0;
        let isLengthMoreThan100 = true;
        let data = [];

        while (isLengthMoreThan100) {
            try {
                const response = await fetch('http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=100&last=' + lastRow);
                const json = await response.json();
                json.forEach(k => {
                        let foundIndex = data.findIndex(x => x.label === k.AssetCategoryID);
                        if  (foundIndex < 0) {
                            data.push({label: k.AssetCategoryID, y: 1});
                        } else {
                            data[foundIndex].y++;
                        }

                        if (k.OperationalStatus === "Operational") {
                            noOfOperational++;
                        } else {
                            noOfNonOperational++;
                        }
                    }
                );
                lastRow = lastRow + json.length;
                if (json.length < 100) {
                    isLengthMoreThan100 = false;
                }
            } catch (error) {
                console.log(error);
                break;
            }
        }
        setData(data);
        setOperational(noOfOperational);
        setNonOperational(noOfNonOperational);
    }
}
