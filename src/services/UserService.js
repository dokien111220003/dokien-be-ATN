const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already exist'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({ 
                // tung dong sinh key bang name
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                // neu co crate user thi moi tra ve
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser 
                    // user moi tao
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                reject({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const isPasswordMatch = await bcrypt.compare(password, checkUser.password);

            if (!isPasswordMatch) {
                reject({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isProductManage: checkUser.isProductManage,
                isOrderManage: checkUser.isOrderManage
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isProductManage: checkUser.isProductManage,
                isOrderManage: checkUser.isOrderManage
            })
            // SD khi accTK hết hạn => cấp lại 1 asTK mới

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const createStaff = (staffData) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone, address, isProductManage, isOrderManage } = staffData;
    try {
      const hash = bcrypt.hashSync(password, 10);
      
      const createdStaff = await User.create({
        name,
        email,
        password: hash,
        phone,
        address,
        isAdmin: false,
        isProductManage: isProductManage || false,
        isOrderManage: isOrderManage || false
      });

      if (createdStaff) {
        resolve({
          status: 'OK',
          message: 'Staff account created successfully',
          data: {
            name: createdStaff.name,
            email: createdStaff.email,
            phone: createdStaff.phone,
            address: createdStaff.address,
            isProductManage: createdStaff.isProductManage,
            isOrderManage: createdStaff.isOrderManage
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    createStaff
}