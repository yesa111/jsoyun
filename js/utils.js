export const rectangularCollision = ({ rectangle1 , rectangle2 }) => {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	);
}

export const determineWiner = ({element, fighter1, fighter2, timeId}) => {
	clearTimeout(timeId);
    const result = document.querySelector(element);
	result.style.display = 'flex';
	if(fighter1.stats.health === fighter2.stats.health){
		result.innerHTML = 'Tie';
	}else if(fighter1.stats.health > fighter2.stats.health){
		result.innerHTML = `${fighter1.name} win`;
	}else{
		result.innerHTML = `${fighter2.name} win`;
	}
}