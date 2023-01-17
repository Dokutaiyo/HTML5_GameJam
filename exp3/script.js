const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scores = document.querySelector('#Score')
const gamestart = document.querySelector('#startbtn')
const mainUI = document.querySelector('#mainUI')
const bigScoreDisplay = document.querySelector('#bigScoreDisplay')

canvas.width = innerWidth
canvas.height = innerHeight


class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    const PlayerImage = new Image()
    PlayerImage.src = 'spaceship render 1080p v2.png'
    PlayerImage.onload=()=>{
      this.PlayerImage = PlayerImage
      this.width = PlayerImage.width*0.1
      this.height = PlayerImage.height *0.1
    }
  }
  draw() {
    if(this.PlayerImage)
    ctx.drawImage(this.PlayerImage,this.x-(this.width/2),this.y-(this.height/2),this.width,this.height)
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius;
    this.color = color;
    this.velocity = velocity

    const ProjectileImage = new Image()
    ProjectileImage.src = 'Projectile 2.png'
    ProjectileImage.onload=()=>{
      this.ProjectileImage = ProjectileImage
    }
  }


  draw() {
    if(this.ProjectileImage)
    ctx.drawImage(this.ProjectileImage,this.x-7.5,this.y-7.5,15,15)
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius;
    this.color = color;
    this.velocity = velocity
    const EnemyImage = new Image()
    EnemyImage.src = 'Enemy Ship2.png'
    EnemyImage.onload=()=>{
      this.EnemyImage = EnemyImage
      this.width = EnemyImage.width*0.1
      this.height = EnemyImage.height *0.1
    }
  }

  draw() {
    if(this.EnemyImage)
    ctx.drawImage(this.EnemyImage,this.x-(this.width/2),this.y-(this.height/2),this.width,this.height)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
    ctx.fillStyle = this.color
    
    ctx.fill()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
const x = canvas.width / 2
const y = canvas.height / 2
let player = new Player(x, y, 30, 'blue')

let projectiles = []
let enemies = []

function init() {
  player = new Player(x, y, 30, 'blue')
  projectiles = []
  enemies = []
  score = 0
  scores.innerHTML = score
  bigScoreDisplay.innerHTML = score
}

function spawnEnemies() {
  setInterval(() => {
    const radius = 30
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = 'rgba(0,0,0,0.01)'
    let angle = Math.atan2(
      canvas.height / 2 - y,
      canvas.width / 2 - x
    )

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let score = 0
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.draw()

  projectiles.forEach((projectile, index) => {
    projectile.update()

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  enemies.forEach((Enemy, index) => {
    Enemy.update()
    const dist = Math.hypot(player.x - Enemy.x, player.y - Enemy.y)
    //end phase
    if (dist - Enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      mainUI.style.display = 'flex'
      bigScoreDisplay.innerHTML = score
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - Enemy.x, projectile.y - Enemy.y)

      //collision detection enemy, projectile
      if (dist - Enemy.radius - projectile.radius < 1) {
        //score calc
        score += 1
        scores.innerHTML = score
        setTimeout(() => {
          enemies.splice(index, 1)
          projectiles.splice(projectileIndex, 1)
        }, 0)
      }
    })
  })

}

addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  )

  const velocity = {
    x: Math.cos(angle) * 10,
    y: Math.sin(angle) * 10
  }
  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      5, 'red', velocity
    )
  )
})

gamestart.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  mainUI.style.display = 'none'
})