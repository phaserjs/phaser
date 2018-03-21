/******************************************************************************
 * Creature Runtimes License
 * 
 * Copyright (c) 2015, Kestrel Moon Studios
 * All rights reserved.
 * 
 * Preamble: This Agreement governs the relationship between Licensee and Kestrel Moon Studios(Hereinafter: Licensor).
 * This Agreement sets the terms, rights, restrictions and obligations on using [Creature Runtimes] (hereinafter: The Software) created and owned by Licensor,
 * as detailed herein:
 * License Grant: Licensor hereby grants Licensee a Sublicensable, Non-assignable & non-transferable, Commercial, Royalty free,
 * Including the rights to create but not distribute derivative works, Non-exclusive license, all with accordance with the terms set forth and
 * other legal restrictions set forth in 3rd party software used while running Software.
 * Limited: Licensee may use Software for the purpose of:
 * Running Software on Licensee’s Website[s] and Server[s];
 * Allowing 3rd Parties to run Software on Licensee’s Website[s] and Server[s];
 * Publishing Software’s output to Licensee and 3rd Parties;
 * Distribute verbatim copies of Software’s output (including compiled binaries);
 * Modify Software to suit Licensee’s needs and specifications.
 * Binary Restricted: Licensee may sublicense Software as a part of a larger work containing more than Software,
 * distributed solely in Object or Binary form under a personal, non-sublicensable, limited license. Such redistribution shall be limited to unlimited codebases.
 * Non Assignable & Non-Transferable: Licensee may not assign or transfer his rights and duties under this license.
 * Commercial, Royalty Free: Licensee may use Software for any purpose, including paid-services, without any royalties
 * Including the Right to Create Derivative Works: Licensee may create derivative works based on Software, 
 * including amending Software’s source code, modifying it, integrating it into a larger work or removing portions of Software, 
 * as long as no distribution of the derivative works is made
 * 
 * THE RUNTIMES IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE RUNTIMES OR THE USE OR OTHER DEALINGS IN THE
 * RUNTIMES.
 *****************************************************************************/


// dualQuat

var Q_X = 0;
var Q_Y = 1;
var Q_Z = 2;
var Q_W = 3;

function dualQuat()
{
	this.real = quat.create();
	this.real[Q_W] = 0;
	
	this.imaginary = quat.create();
	this.imaginary[Q_W] = 0;
	
	this.tmpQ1 = quat.create();
};

dualQuat.prototype.reset = function()
{
  quat.identity(this.real);
  this.real[Q_W] = 0;
  quat.identity(this.imaginary);
  this.imaginary[Q_W] = 0;
  quat.identity(this.tmpQ1);
};

dualQuat.prototype.createFromData = function(q0, t)
{
	this.real = q0;
	this.imaginary = quat.create();
	this.imaginary[Q_W] = -0.5 * ( t[Q_X] * q0[Q_X] + t[Q_Y] * q0[Q_Y] + t[Q_Z] * q0[Q_Z]);
    this.imaginary[Q_X] =  0.5 * ( t[Q_X] * q0[Q_W] + t[Q_Y] * q0[Q_Z] - t[Q_Z] * q0[Q_Y]);
    this.imaginary[Q_Y] =  0.5 * (-t[Q_X] * q0[Q_Z] + t[Q_Y] * q0[Q_W] + t[Q_Z] * q0[Q_X]);
    this.imaginary[Q_Z] =  0.5 * ( t[Q_X] * q0[Q_Y] - t[Q_Y] * q0[Q_X] + t[Q_Z] * q0[Q_W]); 
    
};

dualQuat.prototype.add = function(quat_in, real_factor, imaginary_factor)
{
	//real = real.add((quat_in.real.cpy().mul(real_factor)));
	//var tmpQ = quat.clone(quat_in.real);
	quat.copy(this.tmpQ1, quat_in.real);
	
	quat.scale(this.tmpQ1, this.tmpQ1, real_factor);
	quat.add(this.real, this.tmpQ1, this.real);
	
    //imaginary = imaginary.add(quat_in.imaginary.cpy().mul(imaginary_factor));
    //tmpQ = quat.clone(quat_in.imaginary);
  quat.copy(this.tmpQ1, quat_in.imaginary);
  quat.scale(this.tmpQ1, this.tmpQ1, imaginary_factor);
	quat.add(this.imaginary, this.tmpQ1, this.imaginary);
};

dualQuat.prototype.normalize = function()
{
	var norm = quat.length(this.real);
	
	this.real = quat.scale(this.real, this.real, 1.0 / norm);
	this.imaginary = quat.scale(this.imaginary, this.imaginary, 1.0 / norm);
};

var v0 = vec3.create();
var ve = vec3.create();
var trans = vec3.create();
var tmpVec1 = vec3.create();
var tmpVec2 = vec3.create();
var tmpVec0 = vec3.create();
var aVec = vec3.create();
var rot = vec3.create();

dualQuat.prototype.transform = function(p)
{
        v0[Q_X] = this.real[Q_X]; v0[Q_Y] = this.real[Q_Y]; v0[Q_Z] = this.real[Q_Z];

        ve[Q_X] = this.imaginary[Q_X]; ve[Q_Y] = this.imaginary[Q_Y]; ve[Q_Z] = this.imaginary[Q_Z];

        //trans = (ve*real.w - v0*imaginary.w + Vector3.Cross(v0, ve)) * 2.0f;

//        var tmpVec1 = v0.cpy().scl((float)imaginary.w);
        tmpVec1 = vec3.scale(tmpVec1, v0, this.imaginary[Q_W]);
        
//        var tmpVec2 = v0.cpy().crs(ve);
		tmpVec2 = vec3.cross(tmpVec2, v0, ve);
        
        //var tmpVec0 = ve.cpy().scl(real.w);
        //trans = tmpVec0.sub(tmpVec1).add(tmpVec2);
        //trans.scl(2.0f);
        
        tmpVec0 = vec3.scale(tmpVec0, ve, this.real[Q_W]);
        
        aVec = vec3.subtract(aVec, tmpVec0, tmpVec1);
        trans = vec3.add(trans, aVec, tmpVec2);
        trans = vec3.scale(trans, trans, 2.0);

        //var rot = real.transform(p.cpy());
        rot = vec3.transformQuat(rot, p, this.real);

        //return rot.add(trans);
        rot = vec3.add(rot, rot, trans);
        
        return rot;
};

// Utils
var Utils = {};

Utils.setAxisMatrix = function(xAxis, yAxis, zAxis)
{
	var retMat = mat4.create();
	
	var M00 = 0;
	var M01 = 4;
	var M02 = 8;
	var M03 = 12;
	var M10 = 1;
	var M11 = 5;
	var M12 = 9;
	var M13 = 13;
	var M20 = 2;
	var M21 = 6;
	var M22 = 10;
	var M23 = 14;
	var M30 = 3;
	var M31 = 7;
	var M32 = 11;
	var M33 = 15;
	
	retMat[M00] = xAxis[Q_X];
	retMat[M01] = xAxis[Q_Y];
	retMat[M02] = xAxis[Q_Z];
	retMat[M10] = yAxis[Q_X];
	retMat[M11] = yAxis[Q_Y];
	retMat[M12] = yAxis[Q_Z];
	retMat[M20] = zAxis[Q_X];
	retMat[M21] = zAxis[Q_Y];
	retMat[M22] = zAxis[Q_Z];
	retMat[M03] = 0;
	retMat[M13] = 0;
	retMat[M23] = 0;
	retMat[M30] = 0;
	retMat[M31] = 0;
	retMat[M32] = 0;
	retMat[M33] = 1;
	
	retMat = mat4.transpose(retMat, retMat);
	
	return retMat;
};

Utils.matrixToQuat = function(mat_in)
{
	var retQuat = quat.create();
	var te = mat_in,

    m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

    trace = m11 + m22 + m33,
    s;

	if ( trace > 0 ) {

  		s = 0.5 / Math.sqrt( trace + 1.0 );

  		retQuat[Q_W] = 0.25 / s;
  		retQuat[Q_X] = ( m32 - m23 ) * s;
  		retQuat[Q_Y] = ( m13 - m31 ) * s;
  		retQuat[Q_Z] = ( m21 - m12 ) * s;

	} else if ( m11 > m22 && m11 > m33 ) {

  		s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

  		retQuat[Q_W] = ( m32 - m23 ) / s;
  		retQuat[Q_X] = 0.25 * s;
  		retQuat[Q_Y] = ( m12 + m21 ) / s;
		retQuat[Q_Z] = ( m13 + m31 ) / s;

	} else if ( m22 > m33 ) {

  		s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

	  	retQuat[Q_W] = ( m13 - m31 ) / s;
	  	retQuat[Q_X] = ( m12 + m21 ) / s;
	  	retQuat[Q_Y] = 0.25 * s;
	  	retQuat[Q_Z] = ( m23 + m32 ) / s;

	} else {

  		s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

  		retQuat[Q_W] = ( m21 - m12 ) / s;
  		retQuat[Q_X] = ( m13 + m31 ) / s;
  		retQuat[Q_Y] = ( m23 + m32 ) / s;
  		retQuat[Q_Z] = 0.25 * s;

	}	
	
	return retQuat;
};

Utils.rotateVec_90 = function(vec_in)
{
	var ret_vec = vec3.fromValues(-vec_in[Q_Y], vec_in[Q_X], vec_in[Q_Z]);
	
	return ret_vec;
};

Utils.calcRotateMat = function(vec_in)
{
	var dir = vec3.clone(vec_in);
	dir = vec3.normalize(dir, dir);
	
	var pep_dir = Utils.rotateVec_90(dir);
	
	var cur_tangent = vec3.fromValues(dir[Q_X], dir[Q_Y], 0);
	var cur_normal = vec3.fromValues(pep_dir[Q_X], pep_dir[Q_Y], 0);
	var cur_binormal = vec3.fromValues(0, 0, 1);
	
	var cur_rotate = mat4.create();
	cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
	
	return cur_rotate;
};

Utils.getMatTranslate = function(mat_in)
{
	var ret_pos = vec3.create();
	ret_pos[Q_X] = mat_in[12];
	ret_pos[Q_Y] = mat_in[13];
	ret_pos[Q_Z] = mat_in[14];
	
	return ret_pos;
};

Utils.addMat = function(mat1, mat2)
{
	var retMat = mat4.create();
	for(var i = 0; i < 16; i++)
	{
		retMat[i] = mat1[i] + mat2[i];
	}
	
	return retMat;
};

Utils.mulMat = function(mat_in, factor)
{
	var retMat = mat4.create();
	for(var i = 0; i < 16; i++)
	{
		retMat[i] = mat_in[i] * factor;	
	}
	
	return retMat;
};

Utils.clamp = function(num, min, max) {
    return num < min ? min : (num > max ? max : num);
};

  var newVec1 = vec3.create();
  var newVec2 = vec3.create();

Utils.vecInterp = function(vec1, vec2, ratio)
{
	newVec1 = vec3.scale(newVec1, vec1, 1.0 - ratio);
	newVec2 = vec3.scale(newVec2, vec2, ratio);
	
	var retVec = vec3.create();
	retVec = vec3.add(retVec, newVec1, newVec2);
	
	return retVec;
};

Utils.vec2Interp = function(vec_1, vec_2, ratio)
{
	var newVec1 = vec2.create();
	var newVec2 = vec2.create();
	
	newVec1 = vec2.scale(newVec1, vec_1, 1.0 - ratio);
	newVec2 = vec2.scale(newVec2, vec_2, ratio);
	
	var retVec = vec2.create();
	retVec = vec2.add(retVec, newVec1, newVec2);
	
	return retVec;
};

// MeshBone
function MeshBone(key_in, start_pt_in, end_pt_in, parent_transform)
{
	this.key = key_in;
	this.world_rest_angle = 0;
    this.rest_parent_mat = mat4.create();
    this.rest_parent_inv_mat = mat4.create();
    this.rest_world_mat = mat4.create();
    this.rest_world_inv_mat = mat4.create();
    this.bind_world_mat = mat4.create();
    this.bind_world_inv_mat = mat4.create();
    this.parent_world_mat = mat4.create();
    this.parent_world_inv_mat = mat4.create();
    this.local_rest_start_pt = null;
    this.local_rest_end_pt = null;

    this.setRestParentMat(parent_transform, null);
    this.setLocalRestStartPt(start_pt_in);
    this.setLocalRestEndPt(end_pt_in);
    this.setParentWorldInvMat(mat4.create());
    this.setParentWorldMat(mat4.create());
    
    this.local_binormal_dir = vec3.fromValues(0.0,0.0,1.0);
    this.tag_id = 0;
    
    this.children = [];
};

MeshBone.prototype.setRestParentMat = function(transform_in, inverse_in)
{
	this.rest_parent_mat = transform_in;
        if(inverse_in == null) {
            this.rest_parent_inv_mat = mat4.clone(this.rest_parent_mat);
            //rest_parent_inv_mat.inv();
            mat4.invert(this.rest_parent_inv_mat, this.rest_parent_inv_mat);
        }
        else {
            this.rest_parent_inv_mat = mat4.clone(inverse_in);
        }
};

MeshBone.prototype.setParentWorldMat = function(transform_in)
{
  this.parent_world_mat = transform_in;
};

MeshBone.prototype.setParentWorldInvMat = function(transform_in)
{
  this.parent_world_inv_mat = transform_in;
};

MeshBone.prototype.getLocalRestStartPt = function()
{
  return this.local_rest_start_pt;
};

MeshBone.prototype.getLocalRestEndPt = function()
{
  return this.local_rest_end_pt;
};

MeshBone.prototype.setLocalRestStartPt = function(world_pt_in)
{
  //local_rest_start_pt = Vector3.Transform(world_pt_in, rest_parent_inv_mat);
  //this.local_rest_start_pt = world_pt_in.cpy().traMul(rest_parent_inv_mat);
  this.local_rest_start_pt = vec3.create();
  this.local_rest_start_pt = vec3.transformMat4(this.local_rest_start_pt, world_pt_in, this.rest_parent_inv_mat);
  this.calcRestData();
};

MeshBone.prototype.setLocalRestEndPt = function(world_pt_in)
{
  //local_rest_end_pt = Vector3.Transform(world_pt_in, rest_parent_inv_mat);
  //this.local_rest_end_pt = world_pt_in.cpy().traMul(rest_parent_inv_mat);
  this.local_rest_end_pt = vec3.create();
  this.local_rest_end_pt = vec3.transformMat4(this.local_rest_end_pt, world_pt_in, this.rest_parent_inv_mat);
  this.calcRestData();
};

MeshBone.prototype.calcRestData = function()
{
  if(this.local_rest_start_pt == null || this.local_rest_end_pt == null)
  {
    return;
  }

  var calc = this.computeDirs(this.local_rest_start_pt, this.local_rest_end_pt);

  this.local_rest_dir = calc.first;
  this.local_rest_normal_dir = calc.second;

  this.computeRestLength();
};

MeshBone.prototype.setWorldStartPt = function(world_pt_in)
{
  this.world_start_pt = world_pt_in;
};

MeshBone.prototype.setWorldEndPt = function(world_pt_in)
{
  this.world_end_pt = world_pt_in;
};

MeshBone.prototype.fixDQs = function(ref_dq)
{
  //        if( Quaternion.Dot(world_dq.real, ref_dq.real) < 0) {
  //if( world_dq.real.dot(ref_dq.real) < 0) {
  if(quat.dot(this.world_dq.real, ref_dq.real) < 0) {
    //this.world_dq.real = world_dq.real.cpy().mul(-1);
    this.world_dq.real = quat.scale(this.world_dq.real, this.world_dq.real, -1);
    //this.world_dq.imaginary = world_dq.imaginary.cpy().mul(-1);
    this.world_dq.imaginary = quat.scale(this.world_dq.imaginary, this.world_dq.imaginary, -1);
  }

  for(var i = 0; i < this.children.length; i++) {
    var cur_child = this.children[i];
    cur_child.fixDQs(this.world_dq);
  }
};

MeshBone.prototype.initWorldPts = function()
{
  this.setWorldStartPt(this.getWorldRestStartPt());
  this.setWorldEndPt(this.getWorldRestEndPt());

  for(var i = 0; i < this.children.length; i++) {
    this.children[i].initWorldPts();
  }
};

MeshBone.prototype.getWorldRestStartPt = function()
{
  //Vector3 ret_vec = Vector3.Transform(local_rest_start_pt, rest_parent_mat);
  var tmp_mat = this.rest_parent_mat;
  var ret_vec = vec3.create();
  ret_vec = vec3.transformMat4(ret_vec, this.local_rest_start_pt, tmp_mat);

  return ret_vec;
};

MeshBone.prototype.getWorldRestEndPt = function()
{
  //        Vector3 ret_vec = Vector3.Transform(local_rest_end_pt, rest_parent_mat);
  var tmp_mat = this.rest_parent_mat;
  var ret_vec = vec3.create();
  ret_vec = vec3.transformMat4(ret_vec, this.local_rest_end_pt, tmp_mat);

  return ret_vec;
};

MeshBone.prototype.getWorldRestAngle = function()
{
  return this.world_rest_angle;
};

MeshBone.prototype.getWorldRestPos = function()
{
  return this.world_rest_pos;
};

MeshBone.prototype.getWorldStartPt = function()
{
  return this.world_start_pt;
};

MeshBone.prototype.getWorldEndPt = function()
{
  return this.world_end_pt;
};

MeshBone.prototype.getRestParentMat = function()
{
  return this.rest_parent_mat;
};

MeshBone.prototype.getRestWorldMat = function()
{
  return this.rest_world_mat;
};

MeshBone.prototype.getWorldDeltaMat = function()
{
  return this.world_delta_mat;
};

MeshBone.prototype.getParentWorldMat = function()
{
  return this.parent_world_mat;
};

MeshBone.prototype.getParentWorldInvMat = function()
{
  return this.parent_world_inv_mat;
};

MeshBone.prototype.getWorldDq = function()
{
  return this.world_dq;
};

MeshBone.prototype.computeRestParentTransforms = function()
{
  var cur_tangent = vec3.fromValues(this.local_rest_dir[Q_X], this.local_rest_dir[Q_Y], 0);
  var cur_binormal = vec3.fromValues(this.local_binormal_dir[Q_X], this.local_binormal_dir[Q_Y], this.local_binormal_dir[Q_Z]);
  var cur_normal = vec3.fromValues(this.local_rest_normal_dir[Q_X], this.local_rest_normal_dir[Q_Y], 0);

  var cur_translate = mat4.create();
  //cur_translate.setTranslation(local_rest_end_pt.x, local_rest_end_pt.y, 0);
  mat4.translate(cur_translate, cur_translate, this.local_rest_end_pt);

  var cur_rotate = mat4.create();
  /*
     cur_rotate.Right = cur_tangent;
     cur_rotate.Up = cur_normal;
     cur_rotate.Backward = cur_binormal;
   */
  //cur_rotate.set(cur_tangent, cur_normal, cur_binormal, new Vector3(0,0,0));
  cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
  //cur_rotate.tra();

  //Matrix4 cur_final = cur_translate.cpy().mul(cur_rotate);
  var cur_final = mat4.create();
  cur_final = mat4.multiply(cur_final, cur_translate, cur_rotate);

  //rest_world_mat = rest_parent_mat.cpy().mul(cur_final);
  this.rest_world_mat = mat4.create();
  this.rest_world_mat = mat4.multiply(this.rest_world_mat, this.rest_parent_mat, cur_final); 

  this.rest_world_inv_mat = mat4.clone(this.rest_world_mat);
  this.rest_world_inv_mat = mat4.invert(this.rest_world_inv_mat, this.rest_world_inv_mat);
  //Matrix4.Invert(ref rest_world_mat, out rest_world_inv_mat);

//  var world_rest_dir = getWorldRestEndPt().cpy().sub( getWorldRestStartPt());
  var world_rest_dir = vec3.clone(this.getWorldRestEndPt());
  world_rest_dir = vec3.subtract(world_rest_dir, world_rest_dir, this.getWorldRestStartPt());
  
  world_rest_dir = vec3.normalize(world_rest_dir, world_rest_dir);
  this.world_rest_pos = this.getWorldRestStartPt();


  var bind_translate = mat4.create();
  //bind_translate.setTranslation(getWorldRestStartPt().x, getWorldRestStartPt().y, 0);
  bind_translate = mat4.translate(bind_translate, bind_translate, this.getWorldRestStartPt());

  var tVec = vec3.create();
  tVec = vec3.sub(tVec, this.getWorldRestEndPt(), this.getWorldRestStartPt());
  var bind_rotate = Utils.calcRotateMat(tVec);
  //Matrix4 cur_bind_final = bind_translate.cpy().mul(bind_rotate);
  var cur_bind_final = mat4.create();
  cur_bind_final = mat4.multiply(cur_bind_final, bind_translate, bind_rotate);

  this.bind_world_mat = mat4.clone(cur_bind_final);
  this.bind_world_inv_mat = mat4.clone(this.bind_world_mat);
  this.bind_world_inv_mat = mat4.invert(this.bind_world_inv_mat, this.bind_world_inv_mat);
  //Matrix4.Invert(ref bind_world_mat, out bind_world_inv_mat);

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.setRestParentMat(this.rest_world_mat, this.rest_world_inv_mat);
    cur_bone.computeRestParentTransforms();
  }
};

MeshBone.prototype.computeParentTransforms = function()
{
  var translate_parent = mat4.create();
  translate_parent = mat4.translate(translate_parent, translate_parent, this.getWorldEndPt());

  var tVec = vec3.create();
  tVec = vec3.subtract(tVec, this.getWorldEndpt(), this.getWorldStartPt());
  var rotate_parent = Utils.calcRotateMat(tVec);

  var final_transform = mat4.create();
  final_transform = mat4.multiply(final_transform, translate_parent, rotate_parent);

  var final_inv_transform = mat4.clone(final_transform);
  //final_inv_transform.inv();
  final_inv_transform = mat4.invert(final_inv_transform, final_inv_transform);

  for(var i = 0; i < children.length; i++) {
    var cur_bone = children[i];
    cur_bone.setParentWorldMat(final_transform);
    cur_bone.setParentWorldInvMat(final_inv_transform);
    cur_bone.computeParentTransforms();
  }
};

MeshBone.prototype.computeWorldDeltaTransforms = function()
{
  var calc = this.computeDirs(this.world_start_pt, this.world_end_pt);
  var cur_tangent = vec3.fromValues(calc["first"][Q_X], calc["first"][Q_Y], 0);
  var cur_normal = vec3.fromValues(calc["second"][Q_X], calc["second"][Q_Y], 0);
  var cur_binormal = vec3.fromValues(this.local_binormal_dir[Q_X], this.local_binormal_dir[Q_Y], this.local_binormal_dir[Q_Z]);

  var cur_rotate = mat4.create();
  /*
     cur_rotate.Right = cur_tangent;
     cur_rotate.Up = cur_normal;
     cur_rotate.Backward = cur_binormal;
   */
  //cur_rotate.set(cur_tangent, cur_normal, cur_binormal, new Vector3(0,0,0));
  cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
  
  //cur_rotate.tra();

  var cur_translate = mat4.create();
  //cur_translate.setTranslation(world_start_pt.x, world_start_pt.y, 0);
  cur_translate = mat4.translate(cur_translate, cur_translate, this.world_start_pt);

  /*
     world_delta_mat = (cur_translate * cur_rotate)
   * bind_world_inv_mat;
   */

  this.world_delta_mat = mat4.create();
//  world_delta_mat = (cur_translate.cpy().mul(cur_rotate)).mul(bind_world_inv_mat);
  this.world_delta_mat = mat4.multiply(this.world_delta_mat, cur_translate, cur_rotate);
  this.world_delta_mat = mat4.multiply(this.world_delta_mat, this.world_delta_mat, this.bind_world_inv_mat);


  //        Quaternion cur_quat = XnaGeometry.Quaternion.CreateFromRotationMatrix(world_delta_mat);
  //var tmpMat = mat3.create();
  //tmpMat = mat3.fromMat4(tmpMat, this.world_delta_mat);
  var cur_quat = Utils.matrixToQuat(this.world_delta_mat);


  var tmp_pos =  Utils.getMatTranslate(this.world_delta_mat);
  this.world_dq = new dualQuat();
  this.world_dq.createFromData(cur_quat, tmp_pos);

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.computeWorldDeltaTransforms();
  }
};

MeshBone.prototype.addChild = function(bone_in)
{
  bone_in.setRestParentMat(this.rest_world_mat, this.rest_world_inv_mat);
  this.children.push(bone_in);
};

MeshBone.prototype.getChildren = function() 
{
  return this.children;
};

MeshBone.prototype.hasBone = function(bone_in)
{
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    if(cur_bone == bone_in) {
      return true;
    }
  }

  return false;
};

MeshBone.prototype.getChildByKey = function(search_key)
{
  if(this.key === search_key) {
    return this;
  }

  var ret_data = null;
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];

    var result = cur_bone.getChildByKey(search_key);
    if(result != null) {
      ret_data = result;
      break;
    }
  }

  return ret_data;
};

MeshBone.prototype.getKey = function()
{
  return this.key;
};

MeshBone.prototype.getAllBoneKeys = function()
{
  var ret_data = [];
  ret_data.push(this.getKey());

  for(var i = 0; i < this.children.length; i++) {
    var append_data = this.children[i].getAllBoneKeys();
    ret_data = ret_data.concat(append_data);
  }

  return ret_data;
};

MeshBone.prototype.getAllChildren = function()
{
  var ret_data = [];
  ret_data.push(this);
  for(var i = 0; i < this.children.length; i++) {
    var append_data = this.children[i].getAllChildren();
    ret_data = ret_data.concat(append_data);
  }

  return ret_data;
};

MeshBone.prototype.getBoneDepth = function(bone_in, depth)
{
  if(bone_in == this) {
    return depth;
  }

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    var ret_val = cur_bone.getBoneDepth(bone_in, depth + 1);
    if(ret_val != -1) {
      return ret_val;
    }
  }

  return -1;
};

MeshBone.prototype.isLeaf = function() 
{
  return this.children.length == 0;
};

MeshBone.prototype.deleteChildren = function()
{
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.deleteChildren();
  }

  this.children = [];
};

MeshBone.prototype.setTagId = function(value_in)
{
  this.tag_id = value_in;
};

MeshBone.prototype.getTagId = function()
{
  return this.tag_id;
};

MeshBone.prototype.computeDirs = function(start_pt, end_pt)
{
  var tangent = vec3.create();
  tangent = vec3.subtract(tangent, end_pt, start_pt);
  tangent = vec3.normalize(tangent, tangent);

  var normal = Utils.rotateVec_90(tangent);

  var retData = {};
  retData["first"] = tangent;
  retData["second"] = normal;
  
  return retData;
};

MeshBone.prototype.computeRestLength = function()
{
  var tmp_dir = vec3.create();
  //Vector3 tmp_dir = local_rest_end_pt.cpy().sub(local_rest_start_pt);
  tmp_dir = vec3.subtract(tmp_dir, this.local_rest_end_pt, this.local_rest_start_pt);
  
  this.rest_length = vec3.length(tmp_dir);
};

// MeshRenderRegion
function MeshRenderRegion(indices_in, rest_pts_in, uvs_in, start_pt_index_in, end_pt_index_in,
									start_index_in, end_index_in)
{
	this.store_indices = indices_in;
	this.store_rest_pts = rest_pts_in;
	this.store_uvs = uvs_in;

	this.use_local_displacements = false;
	this.use_post_displacements = false;
	this.use_uv_warp = false;
	this.uv_warp_local_offset = vec2.fromValues(0,0);
	this.uv_warp_global_offset = vec2.fromValues(0,0);
	this.uv_warp_scale = vec2.fromValues(1,1);
	this.start_pt_index = start_pt_index_in;
	this.end_pt_index = end_pt_index_in;
	this.start_index = start_index_in;
	this.end_index = end_index_in;
	this.main_bone = null;
	this.local_displacements = [];
	this.post_displacements = [];
	this.uv_warp_ref_uvs = [];
	this.normal_weight_map = {};
	this.fast_normal_weight_map = [];
	this.fast_bones_map = [];
	this.relevant_bones_indices = [];
	this.use_dq = true;
	this.tag_id = -1;

	this.initUvWarp();	
};

MeshRenderRegion.prototype.getIndicesIndex = function()
{
  // return store_indices + (start_index);
  return this.start_index;
};

MeshRenderRegion.prototype.getRestPtsIndex = function()
{
  // return store_rest_pts + (3 * start_pt_index);
  return 3 * this.start_pt_index;
};

MeshRenderRegion.prototype.getUVsIndex = function()
{
  // return store_uvs + (2  * start_pt_index);
  return 2  * this.start_pt_index;
};

MeshRenderRegion.prototype.getNumPts = function()
{
  return this.end_pt_index - this.start_pt_index + 1;
};

MeshRenderRegion.prototype.getStartPtIndex = function()
{
  return this.start_pt_index;
};

MeshRenderRegion.prototype.getEndPtIndex = function()
{
  return this.end_pt_index;
};

MeshRenderRegion.prototype.getNumIndices = function()
{
  return this.end_index - this.start_index + 1;
};

MeshRenderRegion.prototype.getStartIndex = function()
{
  return this.start_index;
};

MeshRenderRegion.prototype.getEndIndex = function()
{
  return this.end_index;
};

var accum_dq = new dualQuat();
var accum_mat = mat4.create();
var final_pt = vec3.create();
var tmp1 = vec3.create();
var tmp2 = vec3.create();

MeshRenderRegion.prototype.poseFinalPts = function(output_pts, output_start_index, bones_map)
{
  var read_pt_index = this.getRestPtsIndex();
  var write_pt_index = output_start_index;

  // point posing
  for(var i = 0; i < 16; i++)
  {
  	accum_mat[i] = 0.0;
  }

  var boneKeys = Object.keys(bones_map);
  var boneKeyLength = boneKeys.length;
  
  for(var i = 0, l = this.getNumPts(); i < l; i++) {
    var cur_rest_pt =
      vec3.set(tmp1, this.store_rest_pts[0 + read_pt_index],
          this.store_rest_pts[1 + read_pt_index],
          this.store_rest_pts[2 + read_pt_index]);
      // vec3.fromValues(this.store_rest_pts[0 + read_pt_index],
      //     this.store_rest_pts[1 + read_pt_index],
      //     this.store_rest_pts[2 + read_pt_index]);

    if(this.use_local_displacements == true) {
      cur_rest_pt[Q_X] += this.local_displacements[i][Q_X];
      cur_rest_pt[Q_Y] += this.local_displacements[i][Q_Y];
    }

  	for(var j = 0; j < 16; j++)
  	{
	  	accum_mat[j] = 0.0;
  	}
    // reuse
    // var accum_dq = new dualQuat();
    accum_dq.reset();

	var curBoneIndices = this.relevant_bones_indices[i];
  	var relevantIndicesLength = curBoneIndices.length;
    for (var j = 0; j < relevantIndicesLength; j++)
    {
      var idx_lookup = curBoneIndices[j];
      var cur_bone = this.fast_bones_map[idx_lookup];
      var cur_weight_val = this.fast_normal_weight_map[idx_lookup][i];
      var cur_im_weight_val = cur_weight_val;

       var world_dq = cur_bone.getWorldDq();
       accum_dq.add(world_dq, cur_weight_val, cur_im_weight_val);
    }

    accum_dq.normalize();
    var tmp_pt = vec3.set(tmp2, cur_rest_pt[Q_X], cur_rest_pt[Q_Y], cur_rest_pt[Q_Z]);
    // var tmp_pt = vec3.fromValues(cur_rest_pt[Q_X], cur_rest_pt[Q_Y], cur_rest_pt[Q_Z]);
    final_pt = accum_dq.transform(tmp_pt);

    // debug start

    // debug end

    if(this.use_post_displacements == true) {
      final_pt[Q_X] += this.post_displacements[i][Q_X];
      final_pt[Q_Y] += this.post_displacements[i][Q_Y];
    }

    output_pts[0 + write_pt_index] = final_pt[Q_X];
    output_pts[1 + write_pt_index] = final_pt[Q_Y];
    output_pts[2 + write_pt_index] = final_pt[Q_Z];



    read_pt_index += 3;
    write_pt_index += 3;
  }

  // uv warping
  if(this.use_uv_warp == true) {
    this.runUvWarp();
  }
};

MeshRenderRegion.prototype.setMainBoneKey = function(key_in)
{
  this.main_bone_key = key_in;
};

MeshRenderRegion.prototype.determineMainBone = function(root_bone_in)
{
  this.main_bone = root_bone_in.getChildByKey(this.main_bone_key);
};

MeshRenderRegion.prototype.setUseDq = function(flag_in)
{
  this.use_dq = flag_in;
};

MeshRenderRegion.prototype.setName = function(name_in)
{
  this.name = name_in;
};

MeshRenderRegion.prototype.getName = function()
{
  return this.name;
};

MeshRenderRegion.prototype.setUseLocalDisplacements = function(flag_in)
{
  this.use_local_displacements = flag_in;
  if((this.local_displacements.length != this.getNumPts())
      && this.use_local_displacements)
  {
    this.local_displacements = [];
    for(var i = 0; i < this.getNumPts(); i++) {
      this.local_displacements.push (vec2.create());
    }
  }
};

MeshRenderRegion.prototype. getUseLocalDisplacements = function()
{
  return this.use_local_displacements;
};

MeshRenderRegion.prototype.setUsePostDisplacements = function(flag_in)
{
  this.use_post_displacements = flag_in;
  if((this.post_displacements.length != this.getNumPts())
      && this.use_post_displacements)
  {
    this.post_displacements = [];
    for(var i = 0; i < this.getNumPts(); i++) {
      this.post_displacements.push(vec2.create());
    }
  }
};

MeshRenderRegion.prototype.getUsePostDisplacements = function()
{
  return this.use_post_displacements;
};

MeshRenderRegion.prototype.getRestLocalPt = function(index_in)
{
  var read_pt_index = this.getRestPtsIndex() + (3 * index_in);
  var return_pt = vec2.fromValues(this.store_rest_pts[0 + read_pt_index],
      this.store_rest_pts[1 + read_pt_index]);
  return return_pt;
};

MeshRenderRegion.prototype.getLocalIndex = function(index_in)
{
  var read_index = this.getIndicesIndex() + index_in;
  return this.store_indices[read_index];
};

MeshRenderRegion.prototype.clearLocalDisplacements = function()
{
  for(var i = 0; i < this.local_displacements.length; i++) {
    this.local_displacements[i] = vec2.create();
  }
};

MeshRenderRegion.prototype.clearPostDisplacements = function()
{
  for(var i = 0; i < this.post_displacements.length; i++) {
    this.post_displacements[i] = vec2.create();
  }
};

MeshRenderRegion.prototype.setUseUvWarp = function(flag_in)
{
  this.use_uv_warp = flag_in;
  if(this.use_uv_warp == false) {
    this.restoreRefUv();
  }
};

MeshRenderRegion.prototype. getUseUvWarp = function()
{
  return this.use_uv_warp;
};

MeshRenderRegion.prototype.setUvWarpLocalOffset = function(vec_in)
{
  this.uv_warp_local_offset = vec_in;
};

MeshRenderRegion.prototype.setUvWarpGlobalOffset = function(vec_in)
{
  this.uv_warp_global_offset = vec_in;
};

MeshRenderRegion.prototype.setUvWarpScale = function(vec_in)
{
  this.uv_warp_scale = vec_in;
};

MeshRenderRegion.prototype. getUvWarpLocalOffset = function()
{
  return this.uv_warp_local_offset;
};

MeshRenderRegion.prototype. getUvWarpGlobalOffset = function()
{
  return this.uv_warp_global_offset;
};

MeshRenderRegion.prototype. getUvWarpScale = function()
{
  return this.uv_warp_scale;
};

MeshRenderRegion.prototype.runUvWarp = function()
{
  var cur_uvs_index = this.getUVsIndex();
  for(var i = 0; i < this.uv_warp_ref_uvs.length; i++) {
    var set_uv = vec2.clone(this.uv_warp_ref_uvs[i]);
    
   
    set_uv = vec2.subtract(set_uv, set_uv, this.uv_warp_local_offset);
    set_uv[Q_X] *= this.uv_warp_scale[Q_X];
    set_uv[Q_Y] *= this.uv_warp_scale[Q_Y];
    set_uv = vec2.add(set_uv, set_uv, this.uv_warp_global_offset);
    
   
    /*
    set_uv.sub(uv_warp_local_offset);
    set_uv.scl(uv_warp_scale);
    set_uv.add(uv_warp_global_offset);
    */


    this.store_uvs[0 + cur_uvs_index] = set_uv[Q_X];
    this.store_uvs[1 + cur_uvs_index] = set_uv[Q_Y];


    cur_uvs_index += 2;
  }
};

MeshRenderRegion.prototype.restoreRefUv = function()
{
  var cur_uvs_index = this.getUVsIndex();
  for(var i = 0; i < this.uv_warp_ref_uvs.length; i++) {
    var set_uv = this.uv_warp_ref_uvs[i];

    this.store_uvs[0 + cur_uvs_index] = set_uv[Q_X];
    this.store_uvs[1 + cur_uvs_index] = set_uv[Q_Y];

    cur_uvs_index += 2;
  }
};

MeshRenderRegion.prototype.getTagId = function()
{
  return this.tag_id;
};

MeshRenderRegion.prototype.setTagId = function(value_in)
{
  this.tag_id = value_in;
};

MeshRenderRegion.prototype.initFastNormalWeightMap = function(bones_map)
{
  this.relevant_bones_indices = [];
  
  // fast normal weight map lookup, avoids hash lookups
  for (var cur_key in bones_map) {
    var values = this.normal_weight_map[cur_key];
    this.fast_normal_weight_map.push(values);
  }
  
  // relevant bone indices
  var cutoff_val = 0.05;
   for(var i = 0; i < this.getNumPts(); i++) {
  	var curIndicesArray = [];
   	for (var j = 0; j < this.fast_normal_weight_map.length; j++)
  	{
  		var cur_val = this.fast_normal_weight_map[j][i];
  		if(cur_val > cutoff_val)
  		{
  			curIndicesArray.push(j);
  		}  		
  	}
  	
  	this.relevant_bones_indices.push(curIndicesArray);
  }
  
  // fast bone map lookup
    for (var cur_key in bones_map) {
    	var cur_bone = bones_map[cur_key];
    	this.fast_bones_map.push(cur_bone);
    }
};

MeshRenderRegion.prototype.initUvWarp = function()
{
  var cur_uvs_index = this.getUVsIndex();
  //        uv_warp_ref_uvs = new java.util.Vector<Vector2>(new Vector2[getNumPts()]);
  this.uv_warp_ref_uvs = [];;

  for(var i = 0; i < this.getNumPts(); i++) {
    this.uv_warp_ref_uvs.push(vec2.create());
    
    this.uv_warp_ref_uvs[i] = vec2.fromValues(this.store_uvs[cur_uvs_index],
    										this.store_uvs[cur_uvs_index + 1]);
     


    cur_uvs_index += 2;
  }
};


// MeshRenderBoneComposition
function MeshRenderBoneComposition()
{
	this.root_bone = null;
    this.bones_map = {};
    this.regions = [];
    this.regions_map = {};
};

MeshRenderBoneComposition.prototype.addRegion = function(region_in)
{
  this.regions.push(region_in);
};

MeshRenderBoneComposition.prototype.setRootBone = function(root_bone_in)
{
  this.root_bone = root_bone_in;
};

MeshRenderBoneComposition.prototype.getRootBone = function()
{
  return this.root_bone;
};

MeshRenderBoneComposition.prototype.initBoneMap = function()
{
  this.bones_map = MeshRenderBoneComposition.genBoneMap(this.root_bone);
};

MeshRenderBoneComposition.prototype.initRegionsMap = function()
{
  this.regions_map = {};
  for(var i = 0; i < this.regions.length; i++) {
    cur_key = this.regions[i].getName();
    this.regions_map[cur_key] = this.regions[i];
  }
};

MeshRenderBoneComposition.genBoneMap = function(input_bone)
{
  var ret_map = {};
  var all_keys = input_bone.getAllBoneKeys();
  for(var i = 0; i < all_keys.length; i++) {
    var cur_key = all_keys[i];
    ret_map[cur_key] = input_bone.getChildByKey(cur_key);
  }

  return ret_map;
};

MeshRenderBoneComposition.prototype.getBonesMap = function()
{
  return this.bones_map;
};

MeshRenderBoneComposition.prototype.getRegionsMap = function()
{
  return this.regions_map;
};

MeshRenderBoneComposition.prototype.getRegions = function()
{
  return this.regions;
};

MeshRenderBoneComposition.prototype.getRegionWithId = function(id_in)
{
  for(var i = 0; i < this.regions.length; i++) {
    var cur_region = this.regions[i];
    if(cur_region.getTagId() == id_in) {
      return cur_region;
    }
  }

  return null;
};

MeshRenderBoneComposition.prototype.resetToWorldRestPts = function()
{
  this.getRootBone().initWorldPts();
};

MeshRenderBoneComposition.prototype.updateAllTransforms = function(update_parent_xf)
{
  if(update_parent_xf) {
    this.getRootBone().computeParentTransforms();
  }

  this.getRootBone().computeWorldDeltaTransforms();
  this.getRootBone().fixDQs(this.getRootBone().getWorldDq());
};

// MeshBoneCache
function MeshBoneCache(key_in)
{
	this.key = key_in;
};

MeshBoneCache.prototype.setWorldStartPt = function(pt_in) {
  this.world_start_pt = pt_in;
};

MeshBoneCache.prototype.setWorldEndPt = function(pt_in) {
  this.world_end_pt = pt_in;
};

MeshBoneCache.prototype.getWorldStartPt = function() {
  return this.world_start_pt;
};

MeshBoneCache.prototype.getWorldEndPt = function() {
  return this.world_end_pt;
};

MeshBoneCache.prototype.getKey = function() {
  return this.key;
};

// MeshDisplacementCache
function MeshDisplacementCache(key_in)
{
	this.key = key_in;
	this.local_displacements = [];
	this.post_displacements = [];
};

MeshDisplacementCache.prototype.setLocalDisplacements = function(displacements_in)
{
  this.local_displacements = displacements_in;
};

MeshDisplacementCache.prototype.setPostDisplacements = function(displacements_in)
{
  this.post_displacements = displacements_in;
};

MeshDisplacementCache.prototype.getKey = function() {
  return this.key;
};

MeshDisplacementCache.prototype.getLocalDisplacements = function()
{
  return this.local_displacements;
};

MeshDisplacementCache.prototype.getPostDisplacements = function()
{
  return this.post_displacements;
};


// MeshUVWarpCache
function MeshUVWarpCache(key_in)
{
	this.uv_warp_global_offset = vec2.create();
    this.uv_warp_local_offset = vec2.create();
    this.uv_warp_scale = vec2.fromValues(-1,-1);
    this.key = key_in;
    this.enabled = false;
};

MeshUVWarpCache.prototype.setUvWarpLocalOffset = function(vec_in)
{
  this.uv_warp_local_offset = vec_in;
};

MeshUVWarpCache.prototype.setUvWarpGlobalOffset = function(vec_in)
{
  this.uv_warp_global_offset = vec_in;
};

MeshUVWarpCache.prototype.setUvWarpScale = function(vec_in)
{
  this.uv_warp_scale = vec_in;
};

MeshUVWarpCache.prototype.getUvWarpLocalOffset = function()
{
  return this.uv_warp_local_offset;
};

MeshUVWarpCache.prototype.getUvWarpGlobalOffset = function()
{
  return this.uv_warp_global_offset;
};

MeshUVWarpCache.prototype.getUvWarpScale = function()
{
  return this.uv_warp_scale;
};

MeshUVWarpCache.prototype.getKey = function() {
  return this.key;
};

MeshUVWarpCache.prototype.setEnabled = function(flag_in)
{
  this.enabled = flag_in;
};

MeshUVWarpCache.prototype.getEnabled = function() {
  return this.enabled;
};

// MeshBoneCacheManager
function MeshBoneCacheManager()
{
	this.is_ready = false;
	this.bone_cache_table = null;
	this.bone_cache_data_ready = null;
	this.bone_cache_table = [];
	this.bone_cache_data_ready = [];
};

MeshBoneCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.bone_cache_table = [];

  this.bone_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.bone_cache_table.push([]);
    this.bone_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshBoneCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshBoneCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshBoneCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.bone_cache_table.length) - 1);

  return retval;
};

MeshBoneCacheManager.prototype.retrieveValuesAtTime = function(time_in, bone_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.bone_cache_data_ready.length == 0) {
    return;
  }

  if((this.bone_cache_data_ready[base_time] == false)
      || ((this.bone_cache_data_ready[end_time] == false)))
  {
    return;
  }

  var base_cache = this.bone_cache_table[base_time];
  var end_cache = this.bone_cache_table[end_time];

  for(var i = 0, l = base_cache.length; i < l; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var final_world_start_pt = Utils.vecInterp(base_data.getWorldStartPt(), end_data.getWorldStartPt(), ratio);

    var final_world_end_pt = Utils.vecInterp(base_data.getWorldEndPt(), end_data.getWorldEndPt(), ratio);

    /*
       Vector3 final_world_start_pt = ((1.0f - ratio) * base_data.getWorldStartPt()) +
       (ratio * end_data.getWorldStartPt());

       Vector3 final_world_end_pt = ((1.0f - ratio) * base_data.getWorldEndPt()) +
       (ratio * end_data.getWorldEndPt());
     */

    bone_map[cur_key].setWorldStartPt(final_world_start_pt);
    bone_map[cur_key].setWorldEndPt(final_world_end_pt);
  }
};

MeshBoneCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.bone_cache_data_ready.size(); i++) {
      if(this.bone_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshBoneCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.bone_cache_data_ready.length; i++) {
    this.bone_cache_data_ready[i] = true;
  }
};

// MeshDisplacementCacheManager
function MeshDisplacementCacheManager()
{
	this.is_ready = false;
    this.displacement_cache_table = null;
    this.displacement_cache_data_ready = null;
    this.displacement_cache_table = [];
    this.displacement_cache_data_ready = [];
};

MeshDisplacementCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.displacement_cache_table = [];

  this.displacement_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.displacement_cache_table.push([]);
    this.displacement_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshDisplacementCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshDisplacementCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshDisplacementCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.displacement_cache_table.length) - 1);

  return retval;
};

MeshDisplacementCacheManager.prototype.retrieveValuesAtTime = function(time_in, regions_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.displacement_cache_data_ready.length == 0) {
    return;
  }

  if((this.displacement_cache_data_ready[base_time] == false)
      || (this.displacement_cache_data_ready[end_time] == false))
  {
    return;
  }

  var base_cache = this.displacement_cache_table[base_time];
  var end_cache = this.displacement_cache_table[end_time];

  for(var i = 0; i < base_cache.length; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var set_region = regions_map[cur_key];

    if(set_region.getUseLocalDisplacements()) {
      var displacements =
        set_region.local_displacements;
      if((base_data.getLocalDisplacements().length == displacements.length)
          && (end_data.getLocalDisplacements().length == displacements.length))
      {
        for(var j = 0; j < displacements.length; j++) {
          var interp_val = Utils.vec2Interp(base_data.getLocalDisplacements()[j], 
          									end_data.getLocalDisplacements()[j],
          									ratio);
                
          /*
             Vector2 interp_val =
             ((1.0f - ratio) * base_data.getLocalDisplacements().get(j)) +
             (ratio * end_data.getLocalDisplacements().get(j));
           */

          displacements[j] = interp_val;
        }
      }
      else {
        for(var j = 0; j < displacements.length; j++) {
          displacements[j] = vec2.create();
        }
      }
    }

    if(set_region.getUsePostDisplacements()) {
      var displacements =
        set_region.post_displacements;
      if((base_data.getPostDisplacements().length == displacements.length)
          && (end_data.getPostDisplacements().length == displacements.length))
      {

        for(var j = 0; j < displacements.length; j++) {
          var interp_val = Utils.vec2Interp(base_data.getPostDisplacements()[j], 
          									end_data.getPostDisplacements()[j],
          									ratio);                
                
          /*
             Vector2 interp_val =
             ((1.0f - ratio) * base_data.getPostDisplacements()[j]) +
             (ratio * end_data.getPostDisplacements()[j]);
           */
          displacements[j] = interp_val;
        }
      }
      else {
        for(var j = 0; j < displacements.length; j++) {
          displacements.set[j] = vec2.create();
        }
      }
    }
  }
};

MeshDisplacementCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.displacement_cache_data_ready.length; i++) {
      if(this.displacement_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshDisplacementCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.displacement_cache_data_ready.length; i++) {
    this.displacement_cache_data_ready[i] = true;
  }
};

// MeshUVWarpCacheManager
function MeshUVWarpCacheManager()
{
	this.is_ready = false;
    this.uv_cache_table = null;
    this.uv_cache_data_ready = null;
    this.uv_cache_table = [];
    this.uv_cache_data_ready = [];	
};

MeshUVWarpCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.uv_cache_table = [];

  this.uv_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.uv_cache_table.push([]);
    this.uv_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshUVWarpCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshUVWarpCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshUVWarpCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.uv_cache_table.length) - 1);

  return retval;
};

MeshUVWarpCacheManager.prototype.retrieveValuesAtTime = function(time_in, regions_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.uv_cache_data_ready.length == 0) {
    return;
  }

  if((this.uv_cache_data_ready[base_time] == false)
      || (this.uv_cache_data_ready[end_time] == false))
  {
    return;
  }

  var base_cache = this.uv_cache_table[base_time];
  var end_cache = this.uv_cache_table[end_time];

  for(var i = 0; i < base_cache.length; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var set_region = regions_map[cur_key];
    if(set_region.getUseUvWarp()) {
      var final_local_offset = base_data.getUvWarpLocalOffset();
      
 
      var final_global_offset = base_data.getUvWarpGlobalOffset();

      var final_scale = base_data.getUvWarpScale();
      /*
         Vector2 final_local_offset = ((1.0f - ratio) * base_data.getUvWarpLocalOffset()) +
         (ratio * end_data.getUvWarpLocalOffset());

         Vector2 final_global_offset = ((1.0f - ratio) * base_data.getUvWarpGlobalOffset()) +
         (ratio * end_data.getUvWarpGlobalOffset());

         Vector2 final_scale = ((1.0f - ratio) * base_data.getUvWarpScale()) +
         (ratio * end_data.getUvWarpScale());

       */


      set_region.setUvWarpLocalOffset(final_local_offset);
      set_region.setUvWarpGlobalOffset(final_global_offset);
      set_region.setUvWarpScale(final_scale);
    }
  }
};

MeshUVWarpCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.uv_cache_data_ready.length; i++) {
      if(uv_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshUVWarpCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.uv_cache_data_ready.length; i++) {
    this.uv_cache_data_ready[i] = true;
  }
};

// CreatureModuleUtils
var CreatureModuleUtils = {};

CreatureModuleUtils.GetAllAnimationNames = function(json_data)
{
  var json_animations = json_data["animation"];
  var keys = [];
  for (var name in json_animations)
  {
    keys.push(name);
  }

  return keys;
};

CreatureModuleUtils.getFloatArray = function(raw_data)
{
  return raw_data;
};

CreatureModuleUtils.getIntArray = function(raw_data)
{
  return raw_data;
};


CreatureModuleUtils.ReadPointsArray2DJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  var ret_list = [];
  var num_points = raw_array.length / 2;
  for (var i = 0; i < num_points; i++)
  {
    var cur_index = i * 2;
    ret_list.push(
        vec2.fromValues(raw_array[0 + cur_index], raw_array[1 + cur_index]));
  }

  return ret_list;
};

CreatureModuleUtils.ReadFloatArray3DJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);

  var ret_list = [];
  var num_points = raw_array.length / 2;
  for (var i = 0; i < num_points; i++)
  {
    var cur_index = i * 2;
    ret_list.push(raw_array[0 + cur_index]);
    ret_list.push(raw_array[1 + cur_index]);
    ret_list.push(0);
  }

  return ret_list;
};

CreatureModuleUtils.ReadBoolJSON = function(data, key)
{
  var val = data[key];
  return val;
};

CreatureModuleUtils.ReadFloatArrayJSON = function(data, key)
{
  /*
  var raw_array = getFloatArray(data.get[key]);
  var ret_list = [];
  for(var i = 0; i < raw_array.length; i++)
  {
    ret_list.push(raw_array[i]);
  }

  return ret_list;
  */
 
  return data[key];
};

CreatureModuleUtils.ReadIntArrayJSON = function(data, key)
{
  /*
  int[] raw_array = getIntArray (data.get(key));
  java.util.Vector<Integer> ret_list = new java.util.Vector<Integer>();

  for(int i = 0; i < raw_array.length; i++) {
    ret_list.add(raw_array[i]);
  }

  return ret_list;
  */
   return data[key];
};

CreatureModuleUtils.ReadMatrixJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  var retMat = mat4.create();
  for(var i = 0; i < 16; i++)
  {
  	retMat[i] = raw_array[i];
  }
  
  return retMat;
};

CreatureModuleUtils.ReadVector2JSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  return vec2.fromValues(raw_array[0], raw_array[1]);
};


CreatureModuleUtils.ReadVector3JSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  return vec3.fromValues(raw_array[0], raw_array[1], 0);
};

CreatureModuleUtils.CreateBones = function(json_obj, key) {
  var root_bone = null;
  var base_obj = json_obj[key];
  //var bone_data = new HashMap<Integer, Tuple<MeshBone, Vector<Integer>>>();
  var bone_data = {};
  var child_set = {};

  // layout bones
  for (var cur_name in base_obj)
  {
  	
    var cur_node = base_obj[cur_name];

    var cur_id = cur_node["id"]; //GetJSONNodeFromKey(*cur_node, "id")->value.toNumber();
    var cur_parent_mat = CreatureModuleUtils.ReadMatrixJSON(cur_node, "restParentMat");

    var cur_local_rest_start_pt = CreatureModuleUtils.ReadVector3JSON(cur_node, "localRestStartPt");
    var cur_local_rest_end_pt = CreatureModuleUtils.ReadVector3JSON(cur_node, "localRestEndPt");
    var cur_children_ids = CreatureModuleUtils.ReadIntArrayJSON(cur_node, "children");

    var new_bone = new MeshBone(cur_name,
        vec3.create(),
        vec3.create(),
        cur_parent_mat);
    new_bone.local_rest_start_pt = cur_local_rest_start_pt;
    new_bone.local_rest_end_pt = cur_local_rest_end_pt;
    new_bone.calcRestData();
    new_bone.setTagId(cur_id);

    bone_data[cur_id] = {first:new_bone, second:cur_children_ids};

    for(var i = 0; i < cur_children_ids.length; i++){
      var cur_child_id = cur_children_ids[i];
      child_set[cur_child_id] = cur_child_id;
    }
  }

  // Find root
  for(var cur_id in bone_data)
  {
    if( (cur_id in child_set) == false) {
      // not a child, so is root
	  var cur_data = bone_data[cur_id]; 
      root_bone = cur_data.first;
      break;
    }
  }

  // construct hierarchy
  for(var cur_id in bone_data)
  {
 	var cur_data = bone_data[cur_id]; 

    var cur_bone = cur_data.first;
    var children_ids = cur_data.second;
    for(var i = 0; i < children_ids.length; i++)
    {
      var cur_child_id = children_ids[i];
      var child_bone = bone_data[cur_child_id].first;
      cur_bone.addChild(child_bone);
    }

  }


  return root_bone;
};

CreatureModuleUtils.CreateRegions = function(json_obj, key, indices_in, rest_pts_in, uvs_in)
{
  var ret_regions = [];
  var base_obj = json_obj[key];

  for (var cur_name in base_obj)
  {
  	var cur_node = base_obj[cur_name];

    var cur_id = cur_node["id"]; //(int)GetJSONNodeFromKey(*cur_node, "id")->value.toNumber();
    var cur_start_pt_index = cur_node["start_pt_index"]; //(int)GetJSONNodeFromKey(*cur_node, "start_pt_index")->value.toNumber();
    var cur_end_pt_index = cur_node["end_pt_index"]; //(int)GetJSONNodeFromKey(*cur_node, "end_pt_index")->value.toNumber();
    var cur_start_index = cur_node["start_index"]; //(int)GetJSONNodeFromKey(*cur_node, "start_index")->value.toNumber();
    var cur_end_index = cur_node["end_index"]; //(int)GetJSONNodeFromKey(*cur_node, "end_index")->value.toNumber();

    var new_region = new MeshRenderRegion(indices_in,
        rest_pts_in,
        uvs_in,
        cur_start_pt_index,
        cur_end_pt_index,
        cur_start_index,
        cur_end_index);

    new_region.setName(cur_name);
    new_region.setTagId(cur_id);

    // Read in weights
    var weight_map =
      new_region.normal_weight_map;
    var weight_obj = cur_node["weights"];

    for (var w_key in weight_obj)
    {
      var w_node = weight_obj[w_key];
      var values = CreatureModuleUtils.ReadFloatArrayJSON(weight_obj, w_key);
      weight_map[w_key] = values;
    }

    ret_regions.push(new_region);
  }

  return ret_regions;
};

CreatureModuleUtils.GetStartEndTimes = function(json_obj, key)
{
  var start_time = 0;
  var end_time = 0;
  var first = true;
  var base_obj = json_obj[key];

  for (var cur_val in base_obj)
  {
    var cur_node = base_obj[cur_val];
    var cur_num = parseInt(cur_val);
    if(first) {
      start_time = cur_num;
      end_time = cur_num;
      first = false;
    }
    else {
      if(cur_num > end_time) {
        end_time = cur_num;
      }
      
      if(cur_num < start_time) {
        start_time = cur_num;
      }
    }
  }

  return {first:start_time, second:end_time};
};

CreatureModuleUtils.FillBoneCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    cache_list = [];

    for (var cur_name in cur_node)
    {
      var bone_node = cur_node[cur_name];

      var cur_start_pt = CreatureModuleUtils.ReadVector3JSON(bone_node, "start_pt"); //ReadJSONVec4_2(*bone_node, "start_pt");
      var cur_end_pt = CreatureModuleUtils.ReadVector3JSON(bone_node, "end_pt"); //ReadJSONVec4_2(*bone_node, "end_pt");

      var cache_data = new MeshBoneCache(cur_name);
      cache_data.setWorldStartPt(cur_start_pt);
      cache_data.setWorldEndPt(cur_end_pt);

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.bone_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

CreatureModuleUtils.FillDeformationCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    var cache_list = [];

    for (var cur_name in cur_node)
    {
      var mesh_node = cur_node[cur_name];

      var cache_data = new MeshDisplacementCache(cur_name);

      var use_local_displacement = CreatureModuleUtils.ReadBoolJSON(mesh_node, "use_local_displacements"); //GetJSONNodeFromKey(*mesh_node, "use_local_displacements")->value.toBool();
      var use_post_displacement = CreatureModuleUtils.ReadBoolJSON(mesh_node, "use_post_displacements"); //GetJSONNodeFromKey(*mesh_node, "use_post_displacements")->value.toBool();

      if(use_local_displacement == true) {
        var read_pts = CreatureModuleUtils.ReadPointsArray2DJSON(mesh_node, "local_displacements"); //ReadJSONPoints2DVector(*mesh_node, "local_displacements");
        cache_data.setLocalDisplacements(read_pts);
      }

      if(use_post_displacement == true) {
        var read_pts = CreatureModuleUtils.ReadPointsArray2DJSON(mesh_node, "post_displacements"); //ReadJSONPoints2DVector(*mesh_node, "post_displacements");
        cache_data.setPostDisplacements(read_pts);
      }

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.displacement_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

CreatureModuleUtils.FillUVSwapCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    var cache_list = [];

    for (var cur_name in cur_node)
    {
      var uv_node = cur_node[cur_name];

      var cache_data = new MeshUVWarpCache(cur_name);
      var use_uv = CreatureModuleUtils.ReadBoolJSON(uv_node, "enabled"); //GetJSONNodeFromKey(*uv_node, "enabled")->value.toBool();
      cache_data.setEnabled(use_uv);
      if(use_uv == true) {
        var local_offset = CreatureModuleUtils.ReadVector2JSON(uv_node, "local_offset"); //ReadJSONVec2(*uv_node, "local_offset");
        var global_offset = CreatureModuleUtils.ReadVector2JSON(uv_node, "global_offset"); //ReadJSONVec2(*uv_node, "global_offset");
        var scale = CreatureModuleUtils.ReadVector2JSON(uv_node, "scale"); //ReadJSONVec2(*uv_node, "scale");
        cache_data.setUvWarpLocalOffset(local_offset);
        cache_data.setUvWarpGlobalOffset(global_offset);
        cache_data.setUvWarpScale(scale);
      }

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.uv_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

// Creature
function Creature(load_data)
{
	this.total_num_pts = 0;
    this.total_num_indices = 0;
    this.global_indices = null;
    this.global_pts = null;
    this.global_uvs = null;
    this.render_pts = null;
    this.render_colours = null;
    this.render_composition = null;
    this.boundary_indices = [];
    this.boundary_min = vec2.create();
    this.boundary_max = vec2.create();

    this.LoadFromData(load_data);	
};

// Fills entire mesh with (r,g,b,a) colours
Creature.prototype.FillRenderColours = function(r, g, b, a)
{
  for(var i = 0; i < this.total_num_pts; i++)
  {
    var cur_colour_index = i * 4;
    this.render_colours[0 + cur_colour_index] = r;
    this.render_colours[1 + cur_colour_index] = g;
    this.render_colours[2 + cur_colour_index] = b;
    this.render_colours[3 + cur_colour_index] = a;
  }
};

// Compute boundary indices

Creature.prototype.ComputeBoundaryIndices = function()
{
	var freq_table = {};
	for(var i = 0; i < this.total_num_pts; i++)
	{
		freq_table[i] = 0;
	}
	
	var cur_regions = this.render_composition.getRegions();
	for(var i = 0; i < this.global_indices.length; i++)
	{
		var cur_idx = this.global_indices[i];
		var is_found = false;
		for(var j = 0; j < cur_regions.length; j++)
		{
    		var cur_region = cur_regions[j];
    		var cur_start_index = cur_region.getStartPtIndex();
    		var cur_end_index = cur_region.getEndPtIndex();
    		
    		if(cur_idx >= cur_start_index && cur_idx <= cur_end_index)
    		{
    			is_found = true;
    			break;
    		}
    	}


		if(is_found)
		{
			freq_table[cur_idx]++;
		}
	}
	
	// now find the boundary indices who have <= 5 referenced triangles
	this.boundary_indices = [];
	for(var i = 0; i < this.total_num_pts; i++)
	{
		if(freq_table[i] <=5)
		{
			this.boundary_indices.push(i);
		}
	}
};

// Compute min and max bounds of the animated mesh
Creature.prototype.ComputeBoundaryMinMax = function()
{
	
	if(this.boundary_indices.length <= 0)
	{
		this.ComputeBoundaryIndices();
	}
	
	
	var firstIdx = this.boundary_indices[0] * 3;
	var minPt = vec2.fromValues(this.render_pts[firstIdx + 0], this.render_pts[firstIdx + 1]);
	var maxPt = vec2.fromValues(minPt[0], minPt[1]);
	
	
	for(var i = 0; i < this.boundary_indices.length; i++)
	{
		var ref_idx = this.boundary_indices[i] * 3;
		var ref_x = this.render_pts[ref_idx];
		var ref_y = this.render_pts[ref_idx + 1];
		
		if(minPt[0] > ref_x)
		{
			minPt[0] = ref_x;
		}
		
		if(minPt[1] > ref_y)
		{
			minPt[1] = ref_y;
		}
		
		if(maxPt[0] < ref_x)
		{
			maxPt[0] = ref_x;
		}
		
		if(maxPt[1] < ref_y)
		{
			maxPt[1] = ref_y;
		}
	}
	
	this.boundary_min = minPt;
	this.boundary_max = maxPt;
};


// Load data
Creature.prototype.LoadFromData = function(load_data)
{
  // Load points and topology
  var json_mesh = load_data["mesh"];

  this.global_pts = CreatureModuleUtils.ReadFloatArray3DJSON(json_mesh, "points");
  this.total_num_pts = this.global_pts.length / 3;

  this.global_indices = CreatureModuleUtils.ReadIntArrayJSON (json_mesh, "indices");
  this.total_num_indices = this.global_indices.length;

  this.global_uvs = CreatureModuleUtils.ReadFloatArrayJSON (json_mesh, "uvs");
  
  
  this.render_colours = [];
  for(var i = 0; i < this.total_num_pts * 4; i++)
  {
    this.render_colours.push(0);
  }
  this.FillRenderColours(1, 1, 1, 1);

  this.render_pts = [];

  // Load bones
  var root_bone = CreatureModuleUtils.CreateBones(load_data, "skeleton");


  // Load regions
  var regions = CreatureModuleUtils.CreateRegions(json_mesh,
      "regions",
      this.global_indices,
      this.global_pts,
      this.global_uvs);

  // Add into composition
  this.render_composition = new MeshRenderBoneComposition();
  this.render_composition.setRootBone(root_bone);
  this.render_composition.getRootBone().computeRestParentTransforms();

  for(var i = 0; i < regions.length; i++) {
  	var cur_region = regions[i];
    cur_region.setMainBoneKey(root_bone.getKey());
    cur_region.determineMainBone(root_bone);
    this.render_composition.addRegion(cur_region);
  }

  this.render_composition.initBoneMap();
  this.render_composition.initRegionsMap();

  for(var i = 0; i < regions.length; i++) {
  	var cur_region = regions[i];
    cur_region.initFastNormalWeightMap(this.render_composition.bones_map);
  }

  this.render_composition.resetToWorldRestPts();
};

// CreatureAnimation
function CreatureAnimation(load_data, name_in)
{
    this.name = name_in;
    this.bones_cache = new MeshBoneCacheManager();
    this.displacement_cache = new MeshDisplacementCacheManager();
    this.uv_warp_cache = new MeshUVWarpCacheManager();
    this.cache_pts = [];
    this.fill_cache_pts = [];

    this.LoadFromData(name_in, load_data);	
};

CreatureAnimation.prototype.LoadFromData = function(name_in, load_data)
{
  var json_anim_base = load_data["animation"];
  var json_clip = json_anim_base[name_in];

  var start_end_times = CreatureModuleUtils.GetStartEndTimes(json_clip, "bones");
  this.start_time = start_end_times.first;
  this.end_time = start_end_times.second;

  // bone animation
  CreatureModuleUtils.FillBoneCache(json_clip,
      "bones",
      this.start_time,
      this.end_time,
      this.bones_cache);

  // mesh deformation animation
  CreatureModuleUtils.FillDeformationCache(json_clip,
      "meshes",
      this.start_time,
      this.end_time,
      this.displacement_cache);

  // uv swapping animation
  CreatureModuleUtils.FillUVSwapCache(json_clip,
      "uv_swaps",
      this.start_time,
      this.end_time,
      this.uv_warp_cache);
};

CreatureAnimation.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.cache_pts.length) - 1);

  return retval;
};

CreatureAnimation.prototype.verifyFillCache = function()
{
	if(this.fill_cache_pts.length == (this.end_time - this.start_time + 1))
	{
		// ready to switch over
		this.cache_pts = this.fill_cache_pts;
	}
};

CreatureAnimation.prototype.poseFromCachePts = function(time_in, target_pts, num_pts)
{
        var cur_floor_time = this.getIndexByTime(Math.floor(time_in));
        var cur_ceil_time = this.getIndexByTime(Math.ceil(time_in));
        var cur_ratio = time_in - Math.floor(time_in);
        
        var set_pt = target_pts;
        var floor_pts = this.cache_pts[cur_floor_time];
        var ceil_pts = this.cache_pts[cur_ceil_time];
        
        var set_idx = 0;
        var floor_idx = 0;
        var ceil_idx = 0;
        
        for(var i = 0; i < num_pts; i++)
        {
            set_pt[set_idx + 0] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 0]) + (cur_ratio * ceil_pts[ceil_idx + 0]);
            set_pt[set_idx + 1] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 1]) + (cur_ratio * ceil_pts[ceil_idx + 1]);
            set_pt[set_idx + 2] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 2]) + (cur_ratio * ceil_pts[ceil_idx + 2]);

            set_idx += 3;
            floor_idx += 3;
            ceil_idx += 3;
        }
};

// CreatureManager
function CreatureManager(target_creature_in)
{
    this.target_creature = target_creature_in;
    this.is_playing = false;
    this.run_time = 0;
    this.time_scale = 30.0;
    this.blending_factor = 0;
    this.should_loop = true;
    this.use_custom_time_range = false;
    this.custom_start_time = 0;
    this.custom_end_time = 0;
    this.animations = {};
    this.bones_override_callback = null;

    this.blend_render_pts = [];
    this.blend_render_pts.push([]);
    this.blend_render_pts.push([]);
    this.do_blending = false;

    this.active_blend_animation_names = [];
    this.active_blend_animation_names.push("");
    this.active_blend_animation_names.push("");	
};

// Create an animation
CreatureManager.prototype.CreateAnimation = function(load_data, name_in)
{
  var new_animation = new CreatureAnimation(load_data, name_in);
  this.AddAnimation(new_animation);
};

// Create all animations
CreatureManager.prototype.CreateAllAnimations = function(load_data)
{
  var all_animation_names = CreatureModuleUtils.GetAllAnimationNames (load_data);
  for(var i = 0; i < all_animation_names.length; i++)
  {
  	var cur_name = all_animation_names[i];
    this.CreateAnimation(load_data, cur_name);
  }

  this.SetActiveAnimationName (all_animation_names.get(0));
};

// Add an animation
CreatureManager.prototype.AddAnimation = function(animation_in)
{
  this.animations[animation_in.name] = animation_in;
};

// Return an animation
CreatureManager.prototype.GetAnimation = function(name_in)
{
  return this.animations[name_in];
};

// Return the creature
CreatureManager.prototype.GetCreature = function()
{
  return this.target_creature;
};

// Returns all the animation names
CreatureManager.prototype.GetAnimationNames = function()
{
  var ret_names = [];
  for(var cur_name in animations) {
    ret_names.push(cur_name);
  }

  return ret_names;
};

// Sets the current animation to be active by name
CreatureManager.prototype.SetActiveAnimationName = function(name_in, check_already_active)
{
  if (name_in == null || (name_in in this.animations) == false) {
    return false;
  }
  
  if(check_already_active == true)
  {
  	if(this.active_animation_name == name_in)
  	{
  		return false;
  	}
  }

  this.active_animation_name = name_in;
  var cur_animation = this.animations[this.active_animation_name];
  this.run_time = cur_animation.start_time;

  var displacement_cache_manager = cur_animation.displacement_cache;
  var displacement_table =
    displacement_cache_manager.displacement_cache_table[0];

  var uv_warp_cache_manager = cur_animation.uv_warp_cache;
  var uv_swap_table =
    uv_warp_cache_manager.uv_cache_table[0];

  var render_composition =
    this.target_creature.render_composition;

  var all_regions = render_composition.getRegions();

  var index = 0;
  for(var i = 0; i < all_regions.length; i++)
  {
  	var cur_region = all_regions[i];
    // Setup active or inactive displacements
    var use_local_displacements = !(displacement_table[index].getLocalDisplacements().length == 0);
    var use_post_displacements = !(displacement_table[index].getPostDisplacements().length == 0);
    cur_region.setUseLocalDisplacements(use_local_displacements);
    cur_region.setUsePostDisplacements(use_post_displacements);

    // Setup active or inactive uv swaps
    cur_region.setUseUvWarp(uv_swap_table[index].getEnabled());

    index++;
  }

  return true;
};

// Returns the name of the currently active animation
CreatureManager.prototype.GetActiveAnimationName = function()
{
  return this.active_animation_name;
};

// Returns the table of all animations
CreatureManager.prototype.GetAllAnimations = function()
{
  return this.animations;
};

// Creates a point cache for the current animation
CreatureManager.prototype.MakePointCache = function(animation_name_in)
{
        var store_run_time = this.getRunTime();
        var cur_animation = this.animations[animation_name_in];
        if(cur_animation.length > 0)
        {
            // cache already generated, just exit
            return;
        }
        
        var cache_pts_list = cur_animation.cache_pts;
        
        for(var i = cur_animation.start_time; i <= cur_animation.end_time; i++)
        {
            this.setRunTime(i);
            var new_pts = [];
            for (var j = 0; j < this.target_creature.total_num_pts * 3; j++) new_pts[j] = 0; 
            //auto new_pts = new glm::float32[target_creature->GetTotalNumPoints() * 3];
            this.PoseCreature(animation_name_in, new_pts);
            
            cache_pts_list.push(new_pts);
        }
        
        this.setRunTime(store_run_time);
};

// Fills up a single frame for a point cache animation
// Point caching is only enabled when the cache is FULLY filled up
// Remember the new filled cache is Appended onto the end of a list
// There is no indexing by time here so MAKE SURE this cache is filled up sequentially!
CreatureManager.prototype.FillSinglePointCacheFrame = function(animation_name_in, time_in)
{
	var store_run_time = this.getRunTime();
    var cur_animation = this.animations[animation_name_in];
	
	this.setRunTime(time_in);
    var new_pts = [];
    for (var j = 0; j < this.target_creature.total_num_pts * 3; j++) new_pts[j] = 0; 
    this.PoseCreature(animation_name_in, new_pts);
    
    cur_animation.fill_cache_pts.push(new_pts);
    cur_animation.verifyFillCache();

    this.setRunTime(store_run_time);
};

// Returns if animation is playing
CreatureManager.prototype.GetIsPlaying = function()
{
  return this.is_playing;
};

// Sets whether to loop the animation
CreatureManager.prototype.SetShouldLoop = function(flag_in)
{
	this.should_loop = flag_in;
};

// Sets whether to use a user defined custom time range for the currently
// active animation clip
CreatureManager.prototype.SetUseCustomTimeRange = function(flag_in)
{
	this.use_custom_time_range = flag_in;
};

// Sets the user defined custom time range
CreatureManager.prototype.SetCustomTimeRange = function(start_time_in, end_time_in)
{
	this.custom_start_time = start_time_in;
	this.custom_end_time = end_time_in;
};

// Sets whether the animation is playing
CreatureManager.prototype.SetIsPlaying = function(flag_in)
{
  this.is_playing = flag_in;
};

// Resets animation to start time
CreatureManager.prototype.ResetToStartTimes = function()
{
  var cur_animation = this.animations[active_animation_name];
  this.run_time = cur_animation.start_time;
};

// Sets the run time of the animation
CreatureManager.prototype.setRunTime = function(time_in)
{
  this.run_time = time_in;
  this.correctTime ();
};

// Increments the run time of the animation by a delta value
CreatureManager.prototype.increRunTime = function(delta_in)
{
  this.run_time += delta_in;
  this.correctTime ();
};

CreatureManager.prototype.correctTime = function()
{
  var cur_animation = this.animations[this.active_animation_name];
  var anim_start_time = cur_animation.start_time;
  var anim_end_time = cur_animation.end_time;
  
  if(this.use_custom_time_range)
  {
  	anim_start_time = this.custom_start_time;
  	anim_end_time = this.custom_end_time;
  }
  
  if(this.run_time > anim_end_time)
  {
  	if(this.should_loop)
  	{
    	this.run_time = anim_start_time;
    }
    else {
    	this.run_time = anim_end_time;
    }
  }
  else if(this.run_time < anim_start_time)
  {
  	if(this.should_loop)
  	{
    	this.run_time = anim_end_time;
    }
    else {
    	this.run_time = anim_start_time;	
    }
  }
};

// Returns the current run time of the animation
CreatureManager.prototype.getRunTime = function()
{
  return this.run_time;
};

// Runs a single step of the animation for a given delta timestep
CreatureManager.prototype.Update = function(delta)
{
  if(!this.is_playing)
  {
    return;
  }

  this.increRunTime(delta * this.time_scale);

  this.RunCreature ();
};

CreatureManager.prototype.RunAtTime = function(time_in)
{
  if(!this.is_playing)
  {
    return;
  }

  this.setRunTime(time_in);
  this.RunCreature ();
};

CreatureManager.prototype.RunCreature = function()
{
  if(this.do_blending)
  {
    for(var i = 0; i < 2; i++) {
      var cur_animation = this.animations[this.active_blend_animation_names[i]];
      if(cur_animation.cache_pts.length > 0)
      {
      	cur_animation.poseFromCachePts(this.getRunTime(), this.blend_render_pts[i], this.target_creature.total_num_pts);
      }
      else {
	  	this.PoseCreature(this.active_blend_animation_names[i], this.blend_render_pts[i]);
	  }
    }

    for(var j = 0; j < this.target_creature.total_num_pts * 3; j++)
    {
      var set_data_index = j;
      var read_data_1 = this.blend_render_pts[0][j];
      var read_data_2 = this.blend_render_pts[1][j];
      /*
         target_creature.render_pts[set_data_index] =
         ((1.0f - blending_factor) * (read_data_1)) +
         (blending_factor * (read_data_2));
       */
      this.target_creature.render_pts.set(set_data_index,
          ((1.0 - blending_factor) * (read_data_1)) +
          (blending_factor * (read_data_2)));

    }
  }
  else {
    var cur_animation = this.animations[this.active_animation_name];
    if(cur_animation.cache_pts.length > 0)
    {
    	cur_animation.poseFromCachePts(this.getRunTime(), this.target_creature.render_pts, this.target_creature.total_num_pts);
    	// cur_animation->poseFromCachePts(getRunTime(), target_creature->GetRenderPts(), target_creature->GetTotalNumPoints());
    }
    else {
		this.PoseCreature(this.active_animation_name, this.target_creature.render_pts);
	}
  }
};

// Sets scaling for time
CreatureManager.prototype.SetTimeScale = function(scale_in)
{
  this.time_scale = scale_in;
};

// Enables/Disables blending
CreatureManager.prototype.SetBlending = function(flag_in)
{
  this.do_blending = flag_in;

  if (this.do_blending) {
    if (this.blend_render_pts[0].length == 0) {
      var new_vec = [];
      for(var i = 0; i < target_creature.total_num_pts * 3; i++)
      {
        new_vec.push(0);
      }

      this.blend_render_pts.set(0, new_vec);
    }

    if (this.blend_render_pts[1].length == 0) {
      var new_vec = [];
      for(var i = 0; i < this.target_creature.total_num_pts * 3; i++)
      {
        new_vec.push(0);
      }

      this.blend_render_pts[1] = new_vec;
    }

  }
};

// Sets blending animation names
CreatureManager.prototype.SetBlendingAnimations = function(name_1, name_2)
{
  this.active_blend_animation_names[0] = name_1;
  this.active_blend_animation_names[1] = name_2;
};

// Sets the blending factor
CreatureManager.prototype.SetBlendingFactor = function(value_in)
{
  this.blending_factor = value_in;
};

// Given a set of coordinates in local creature space,
// see if any bone is in contact
CreatureManager.prototype.IsContactBone = function(pt_in, radius)
{
  var cur_bone = this.target_creature.render_composition.getRootBone();
  return this.ProcessContactBone(pt_in, radius, cur_bone);
};


CreatureManager.prototype.PoseCreature = function(animation_name_in, target_pts)
{
  var cur_animation = this.animations[animation_name_in];

  var bone_cache_manager = cur_animation.bones_cache;
  var displacement_cache_manager = cur_animation.displacement_cache;
  var uv_warp_cache_manager = cur_animation.uv_warp_cache;

  var render_composition =
    this.target_creature.render_composition;

  // Extract values from caches
  var bones_map =
    render_composition.getBonesMap();
  var regions_map =
    render_composition.getRegionsMap();

  bone_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      bones_map);
      
  if(this.bones_override_callback != null)
  {
  	this.bones_override_callback(bones_map);
  }

  displacement_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      regions_map);
  uv_warp_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      regions_map);


  // Do posing, decide if we are blending or not
  var cur_regions =
    render_composition.getRegions();
  var cur_bones =
    render_composition.getBonesMap();

  render_composition.updateAllTransforms(false);
  for(var j = 0, l = cur_regions.length; j < l; j++) {
    var cur_region = cur_regions[j];

    var cur_pt_index = cur_region.getStartPtIndex();


    cur_region.poseFinalPts(target_pts,
        cur_pt_index * 3,
        cur_bones);

    // add in z offsets for different regions
    
    var start = cur_region.getStartPtIndex() * 3;
    var end = cur_region.getEndPtIndex() * 3;
    for(var k = start;
       k <= end;
       k+=3)
    {
       target_pts[k + 2] = -j * 0.001;
    }
     
  }
};

