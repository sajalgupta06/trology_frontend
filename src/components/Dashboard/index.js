import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import "./styles.scss";
import { TooltipItem } from "./toolTip"

const Dashboard = () => {
	const [videoList, setVideoList] = useState([])
	useEffect(() => {
		apiRequest("GET", `/guest/videos`)
			.then(result => {
				const data = JSON.parse(JSON.parse(result).data);
				console.log('===/guest/videos', result)
				if (data && data.result && Array.isArray(data.result)) {
					setVideoList(data.result)
				}
			})
			.catch(err => {
				console.log("error: ", err)
			});

	}, [])
	return (
		<div className="wrapper">
			<header className="sticky">
				<div className="inner_wrapper">
					<div className="hed_left">
						<a href="/"><img src="images/logo.png" alt="" /></a>
					</div>
					<div className="hed_right">
						Enter birth data to personalize the video feed <a className="Personalize" href="personalize">Personalize</a>
					</div>
				</div>
			</header>



			<div className="content_bx">
				<div className="inner_wrapper">
					<div class="con_i_new">
						<ul>
							{videoList.map(v => (
								<li>
									<div class="vid_bx">
										<div class="vid_bx_i">
											<a href={"guest_video_detail/" + v.id}>
												<img src={v.thumbnail} alt="" />
											</a>
											{/* <div class="video_time">5:45</div> */}
										</div>
										<div class="vid_bx_ii">
											<a href="#">
												<table>
													<tr>
														{/* TODO: get astro image and astro name */}
														<td><img src={v.astro_image || "images/user9.png"} alt="" /></td>
														<td>
															{/* <h4 class="dev_ellipsis_title" id={`v_${v.id}`}>{v.title}</h4>
															<Tooltip placement="bottom" isOpen={tooltipOpen} target={`v_${v.id}`} toggle={toggleTooltip}>
																{v.title}
      														</Tooltip> */}
															<TooltipItem title={v.title} id={v.id} elpsisClassName="dev_ellipsis_title"/>
															<p>{v.astro_name}</p>
														</td>
													</tr>
												</table>
											</a>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
					{/* <div className="con_i">
			<ul>

				{
					videoList.map((videoObj)=>
						 (
							<li>
								<div className="vid_bx">
									<div className="vid_bx_i">
									<img src={`${videoObj.thumbnail}`} alt=""/>
									
									</div>
									<div className="vid_bx_ii">
										<a href={"guest_video_detail/" + videoObj.id}><table>
											<tr>
												<td><img src="images/user.png" alt=""/></td>
												<td>
													<h4>{videoObj.title}</h4>
													<p>{videoObj.astro_name}</p>
												</td>
											</tr>
										</table></a>
									</div>
								</div>
							</li>
						)
					)
				}
				
				
			</ul>
		</div> */}
				</div>
			</div>



		</div>
	)
}

export default Dashboard
