
import Card from './Card';

import s from './Skeleton.module.scss';

const Skeleton = ({ itemsNum, displayNum, dim, dir }) => {
    let itemsArr = [];

    for (let i = 0; i < displayNum; i++) {
        let singleItemComponents = [];

        for (let i = 0; i < itemsNum; i++) {
            let itemStyle = {
                'maxWidth': dim[i].w,
                width: '100%',
                height: dim[i].h,
            };
            singleItemComponents.push(
                <div className={s.skeleton__item} style={itemStyle} key={i + 1}></div>
            );
        }

        itemsArr.push(
            <div className={s.skeleton__wrapper} key={i + 1} style={dir === 'row' ? { 'flexDirection': 'row' } : { 'flexDirection': 'column' }}>
                {singleItemComponents}
            </div>
        );
    }


    return (
        <Card className={s.skeleton}>
            {itemsArr}
        </Card>
    );
};

export default Skeleton;