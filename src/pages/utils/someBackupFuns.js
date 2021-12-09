function translatePixToWhite(){
    let container ;
    if ( echarts && echarts.echartsElement ){
        container = echarts.echartsElement.getElementsByTagName('canvas');
        if ( container && container.length) {
            let canvas = container[0];
            let width = canvas.width,height = canvas.height;
            let ctx = canvas.getContext('2d');
            let imageData = ctx.getImageData(0, 0, width, height);
            for(var i = 0; i < imageData.data.length; i += 4) {
                // 当该像素是透明的，则设置成白色
                if(imageData.data[i + 3] == 0) {
                    imageData.data[i] = 255;
                    imageData.data[i + 1] = 255;
                    imageData.data[i + 2] = 255;
                    imageData.data[i + 3] = 255; 
                }
            }
            ctx.putImageData(imageData, 0, 0);
    
            let temp = document.createElement('a');
            temp.download = title + '.png';
            temp.href = canvas.toDataURL('image/png');
            document.body.appendChild(temp);
            temp.click();
            temp.remove();
        }
    }
}