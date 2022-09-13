var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    var graphics = this.add.graphics();

    graphics.lineStyle(2, 0x0000ea);

    //  ST
    graphics.beginPath();
    graphics.moveTo(150, 130);
    graphics.lineTo(265, 130);
    graphics.lineTo(293, 115);
    graphics.lineTo(298, 104);
    graphics.lineTo(287, 89);
    graphics.lineTo(275, 85);
    graphics.lineTo(277, 80);
    graphics.lineTo(318, 80);
    graphics.lineTo(300, 130);
    graphics.lineTo(342, 130);
    graphics.lineTo(355, 80);
    graphics.lineTo(385, 80);
    graphics.lineTo(385, 60);
    graphics.lineTo(267, 60);
    graphics.lineTo(237, 75);
    graphics.lineTo(227, 89);
    graphics.lineTo(238, 103);
    graphics.lineTo(247, 105);
    graphics.lineTo(245, 109);
    graphics.lineTo(172, 109);
    graphics.closePath();
    graphics.strokePath();

    //  A
    graphics.beginPath();
    graphics.moveTo(365, 130);
    graphics.lineTo(394, 60);
    graphics.lineTo(446, 60);
    graphics.lineTo(488, 130);
    graphics.lineTo(451, 130);
    graphics.lineTo(444, 120);
    graphics.lineTo(407, 120);
    graphics.lineTo(402, 130);
    graphics.closePath();
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(411, 100);
    graphics.lineTo(420, 80);
    graphics.lineTo(436, 100);
    graphics.closePath();
    graphics.strokePath();

    //  R
    graphics.beginPath();
    graphics.moveTo(488, 130);
    graphics.lineTo(527, 130);
    graphics.lineTo(518, 108);
    graphics.lineTo(585, 130);
    graphics.lineTo(663, 130);
    graphics.lineTo(642, 109);
    graphics.lineTo(571, 106);
    graphics.lineTo(584, 96);
    graphics.lineTo(573, 79);
    graphics.lineTo(533, 60);
    graphics.lineTo(465, 60);
    graphics.closePath();
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(510, 96);
    graphics.lineTo(540, 96);
    graphics.lineTo(549, 88);
    graphics.lineTo(548, 86);
    graphics.lineTo(535, 79);
    graphics.lineTo(501, 79);
    graphics.closePath();
    graphics.strokePath();

    //  W
    graphics.beginPath();
    graphics.moveTo(100, 232);
    graphics.lineTo(153, 232);
    graphics.lineTo(182, 209);
    graphics.lineTo(173, 232);
    graphics.lineTo(229, 232);
    graphics.lineTo(292, 148);
    graphics.lineTo(260, 148);
    graphics.lineTo(222, 180);
    graphics.lineTo(238, 148);
    graphics.lineTo(206, 148);
    graphics.lineTo(170, 180);
    graphics.lineTo(184, 148);
    graphics.lineTo(139, 148);
    graphics.closePath();
    graphics.strokePath();

    //  A
    graphics.beginPath();
    graphics.moveTo(250, 232);
    graphics.lineTo(300, 232);
    graphics.lineTo(314, 220);
    graphics.lineTo(362, 220);
    graphics.lineTo(370, 232);
    graphics.lineTo(416, 232);
    graphics.lineTo(385, 148);
    graphics.lineTo(314, 148);
    graphics.closePath();
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(320, 200);
    graphics.lineTo(360, 200);
    graphics.lineTo(347, 166);
    graphics.closePath();
    graphics.strokePath();

    //  RS
    graphics.beginPath();
    graphics.moveTo(411, 232);
    graphics.lineTo(460, 232);
    graphics.lineTo(455, 204);
    graphics.lineTo(534, 232);
    graphics.lineTo(672, 232);
    graphics.lineTo(699, 213);
    graphics.lineTo(686, 196);
    graphics.lineTo(633, 178);
    graphics.lineTo(613, 175);
    graphics.lineTo(609, 169);
    graphics.lineTo(692, 169);
    graphics.lineTo(672, 148);
    graphics.lineTo(580, 148);
    graphics.lineTo(558, 164);
    graphics.lineTo(566, 178);
    graphics.lineTo(609, 196);
    graphics.lineTo(628, 199);
    graphics.lineTo(630, 204);
    graphics.lineTo(563, 204);
    graphics.lineTo(523, 199);
    graphics.lineTo(553, 187);
    graphics.lineTo(546, 167);
    graphics.lineTo(500, 148);
    graphics.lineTo(411, 148);
    graphics.closePath();
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(448, 186);
    graphics.lineTo(496, 186);
    graphics.lineTo(512, 182);
    graphics.lineTo(509, 176);
    graphics.lineTo(487, 167);
    graphics.lineTo(443, 167);
    graphics.closePath();
    graphics.strokePath();

    graphics.lineStyle(2, 0x00d701);

    //  Tie Fighter 1

    // graphics.beginPath();
    // graphics.moveTo(448, 186);
    // graphics.lineTo(496, 186);

    // graphics.closePath();
    // graphics.strokePath();

}




